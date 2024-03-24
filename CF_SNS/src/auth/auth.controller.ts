import {
  Body,
  Controller, Header,
  Headers,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PasswordPipe } from './pipe/password.pipe';

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
  async postLoginEmail(@Headers('authorization') rawToken: string) {
    // email:password 된것이 base64로 인코딩되어있다.
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const credentials = this.authService.decodeBasicToken(token);

    return this.authService.loginWithEmail(credentials);
  }

  @Post('register/email')
  postRegisterEmail(
    @Body('nickname') nickname: string,
    @Body('email') email: string,
    @Body('password', PasswordPipe) password: string,
  ) {
    return this.authService.registerWithEmail({
      nickname,
      email,
      password,
    });
  }
}
