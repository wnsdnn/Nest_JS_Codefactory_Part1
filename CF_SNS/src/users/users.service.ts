import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UsersModule } from './users.module';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    // 1) nickname 중복이 없는지 확인
    // exist() -> 만약에 조건에 해당되는 값이 있으면 true 반환
    const nicknameExists = await this.usersRepository.exist({
      where: {
        nickname: user.nickname,
      },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다!');
    }

    // 2) email 중복이 없는지 확인
    const emailExists = await this.usersRepository.exist({
      where: {
        email: user.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다!');
    }

    const userObject = this.usersRepository.create({
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    });

    const newUser = await this.usersRepository.save(userObject);

    return newUser;
  }

  async getAllUsers() {
    return this.usersRepository.find({
      relations: ['posts'],
    });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async followUser(followerId: number, followeeId: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: followerId,
      },
      relations: {
        followees: true,
      },
    });

    if (!user) {
      throw new BadRequestException('존재하지 않는 팔로워입니다.');
    }

    return this.usersRepository.save({
      ...user,
      followees: [
        ...user.followees,
        {
          id: followeeId,
        },
      ],
    });
  }

  async getFollowers(userId: number): Promise<UsersModel[]> {
    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        followers: true,
      },
    });

    return user.followers;
  }
}
