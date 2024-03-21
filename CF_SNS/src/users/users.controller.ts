import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // postUser(
  //   @Body('email') email: string,
  //   @Body('nickname') nickname: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({
  //     email,
  //     nickname,
  //     password,
  //   });
  // }

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }
}
