import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';
import { UsersModule } from './users.module';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async createUser(email: string, nickname: string, password: string) {
    const user = this.usersRepository.create({
      email,
      nickname,
      password,
    });

    const newUser = await this.usersRepository.save(user);

    return newUser;
  }

  async getAllUsers() {
    return this.usersRepository.find({
      relations: ['posts'],
    });
  }
}
