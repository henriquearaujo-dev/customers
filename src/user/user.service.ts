import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  findAll() {
    return 'Retorna todos os usuários';
  }

  findOne(id: string) {
    return 'Retorna um usuário por id' + id;
  }

  create(createUserDto: CreateUserDto) {
    return createUserDto;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: string) {
    return 'Remove um usuário por id' + id;
  }
}
