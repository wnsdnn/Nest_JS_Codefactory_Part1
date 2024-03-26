import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class BearerTokenGuard implements CanActivate {
  constructor(
    private readonly authSevice: AuthService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const rawToken = req.headers['authorization'];

    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }

    const token = this.authSevice.extractTokenFromHeader(rawToken, true);

    const result = await this.authSevice.verifyToken(token);

    const user = await this.usersService.getUserByEmail(result.email);

    /**
     * request에 넣을 정보
     *
     * 1) 사용자 정보 - user
     * 2) token - token
     * 3) tokenType - access | refresh
     */
    req.token = token;
    req.tokenType = result.type;
    req.user = user;

    return true;
  }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 기존 BearerTokenGuard의 canActivate의 절차를 전부 실행
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'access') {
      throw new UnauthorizedException('Access Token이 아닙니다.');
    }

    return true;
  }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 기존 BearerTokenGuard의 canActivate의 절차를 전부 실행
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    if (req.tokenType !== 'refresh') {
      throw new UnauthorizedException('Refresh Token이 아닙니다.');
    }

    return true;
  }
}
