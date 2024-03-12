import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  @Post('users')
  async createPostUser() {
    return await this.userRepository.save({
      // title: 'test title',
    });
  }

  @Get('users')
  async getUsers() {
    return await this.userRepository.find({
      select: {
        id: true,
        title: true,
      },
    });
  }

  @Patch('user/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return await this.userRepository.save({
      ...user,
      title: user.title + '0',
    });
  }
}
