import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User';
import { Repository } from 'typeorm';
import { HashingService } from '../auth/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}
  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (emailExists) {
      throw new ConflictException(`Email em uso.`);
    }

    const passwordHash = await this.hashingService.hash(createUserDto.password);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: passwordHash,
    });

    return await this.userRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException('Nenhum dado fornecido para atualização.');
    }

    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (emailExists) {
        throw new ConflictException('Email está em uso');
      }
    }

    const salt = await bcrypt.genSalt();

    const updateUser = {
      name: updateUserDto.name,
      email: updateUserDto.email,
      ...(updateUserDto.password && {
        password: await bcrypt.hash(updateUserDto.password, salt),
      }),
    };

    await this.userRepository.update(id, updateUser);

    return updateUser;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.userRepository.remove(user);
  }
}
