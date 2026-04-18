import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { User } from '../user/entities/User';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from './hashing/hashing.service';

@Injectable({})
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashindService: HashingService,
  ) {}

  async login(logiDto: LoginDto) {
    const { email, password } = logiDto;

    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordMatching = await this.hashindService.compare(
      password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return { message: 'Login realizado' };
  }
}
