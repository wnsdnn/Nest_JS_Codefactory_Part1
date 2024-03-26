import {
  Body,
  Controller,
  Headers,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MaxLengthPipe, MinLengthPipe } from './pipe/password.pipe';
import { BasicTokenGuard } from './guard/basic-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  postTokenAccess(@Headers('authorization') rawToken: string) {
    // 헤더로 받은 RefreshToken의 값을 검증 및 토큰값만 리턴
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    // 리턴한 토큰값을 가지고 accessToken값 불러오기
    const newToken = this.authService.rotateToken(token, false);

    /**
     * { accessToken: {token} }
     */
    return { accessToken: newToken };
  }

  @Post('token/refresh')
  postTokenRefresh(@Headers('authorization') rawToken: string) {
    // 헤더로 받은 RefreshToken의 값을 검증 및 토큰값만 리턴
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    // 리턴한 토큰값을 가지고 accessToken값 불러오기
    const newToken = this.authService.rotateToken(token, true);

    /**
     * { accessToken: {token} }
     */
    return { refreshToken: newToken };
  }

  @Post('login/email')
  @UseGuards(BasicTokenGuard)
  async postLoginEmail(
    @Headers('authorization') rawToken: string,
    // 요청의 Request 가져오기
    @Request() req,
  ) {
    // email:password 된것이 base64로 인코딩되어있다.
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    // @Body('password', PasswordPipe) password: string,
    @Body('password', new MaxLengthPipe(8, '비밀번호'), new MinLengthPipe(3))
    password: string,
  ) {
    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    });
  }
}
