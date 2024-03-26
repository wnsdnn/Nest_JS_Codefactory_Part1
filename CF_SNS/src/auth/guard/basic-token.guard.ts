/**
 * 구현할 기능
 *
 * 1) 요청 객체 (request)를 불러오고
 *    authorization header로부터 토큰을 가져온다.
 * 2) authService.extractTokenFromHeader를 이용해서
 *    사용 할 수 있는 형태의 토큰을 추출한다.
 * 3) authService.decodeBasicToken을 실행해서
 *    email과 password를 추출한다.
 * 4) email과 password를 이용해서 사용자를 가져온다.
 *    authService.authenticateWithEmailAndPassword
 * 5) 찾아낸 사용자를 (1)번 요청 객체에 붙여준다.
 *    req.user = (4)번의 user;
 */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // false 반환 - Guard 통과 못함
    // true 반환 - Guard 통과

    // 요청의 Request값 가져오기
    const req = context.switchToHttp().getRequest();

    // Request에서 authorization(토큰) 가져오기
    // { authorization: 'Basic token' }
    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }

    // 해당 토큰을 사용해서 accessToken값 가져오기
    const token = this.authService.extractTokenFromHeader(rawToken, false);

    // accessToken을 사용해서 email과 password값 추출
    const { email, password } = this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });

    // 해당 요청에 user라는 값에 user 데이터 추가
    req.user = user;
    return true;
  }
}
