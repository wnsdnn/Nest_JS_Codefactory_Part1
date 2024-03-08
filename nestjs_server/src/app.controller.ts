import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get() => 아무것도 안넣으면 '/'와 같음
  @Get()
  getHome() {
    return 'Home Page!';
  }

  // '/' 생략가능
  @Get('post')
  getPost() {
    return 'Post Page!';
  }

  @Get('user')
  getUser() {
    return 'User Page!';
  }
}
