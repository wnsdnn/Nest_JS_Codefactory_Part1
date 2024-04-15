import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersModel } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFollowersModel } from './entity/user-followers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel]),
    TypeOrmModule.forFeature([UserFollowersModel]),
  ],
  // 다른 모듈에서 imports를 받을려면 exports에 선언해줘야한다.
  exports: [UsersService, UserFollowersModel],
  controllers: [UsersController],
  providers: [UsersService, UserFollowersModel],
})
export class UsersModule {}
