import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  findAll() {
    return 'Retorna todos os usuários';
  }

  findOne(id: string) {
    return 'Retorna um usuário por id';
  }

  create(body: string) {
    return 'Cria um usuário';
  }

  update(id: string, body: string) {
    return 'Atualiza um usuário por id';
  }

  remove(id: string) {
    return 'Remove um usuário por id';
  }
}
