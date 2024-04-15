import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UserFollowersModel } from './entity/user-followers.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
    @InjectRepository(UserFollowersModel)
    private readonly userFollowersRepository: Repository<UserFollowersModel>,
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
    const result = await this.userFollowersRepository.save({
      follower: {
        id: followerId,
      },
      followee: {
        id: followeeId,
      },
    });

    return true;
  }

  async getFollowers(userId: number): Promise<UsersModel[]> {
    /**
     * [
     *   {
     *     id: number;
     *     followers: UsersModel;
     *     followees: UsersModel;
     *     isConfirmed: boolean;
     *     createdAt: Date;
     *     updatedAt: Date;
     *   }
     * ]
     */
    const result = await this.userFollowersRepository.find({
      where: {
        followee: {
          id: userId,
        },
      },
      relations: {
        follower: true,
        followee: true,
      },
    });

    return result.map((data) => data.follower);
  }
}
