import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from './decorator/roles.decorator';
import { RolesEnum } from './entity/const/foles.const';
import { User } from './decorator/user.decorator';
import { UsersModel } from './entity/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(RolesEnum.ADMIN)
  // users.entity에 @Exclude() 선언된 프로퍼티들 조회에서 제외
  // 데이터를 직렬화 할때 무언가를 보이거나 안보이게 할수 있다.
  // @UseInterceptors(ClassSerializerInterceptor)
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 (NestJS) 데이터의 구조를
   *     다른 시스템에서도 쉽게 사용 할 수 있는 포맷으로 변환
   *     -> class의 object에서 JSON 포맷으로 변환
   *
   * deserialization -> 역직렬화
   */
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('follow/me')
  async getFollow(@User() user: UsersModel) {
    return this.usersService.getFollowers(user.id);
  }

  @Post('follow/:id')
  async postFollow(
    @User() user: UsersModel,
    @Param('id', ParseIntPipe) followeeId: number,
  ) {
    await this.usersService.followUser(user.id, followeeId);

    return true;
  }
}
