import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * Roles annotation에 대한 metadata를 가져와야한다.
     *
     * Reflector - IOC Container에서 자동으로 주입 받을수 있음
     * getAllAndOverrider()
     * 설명 - Roles annotation에 해당하는 key 값에 해당하는 annotation에 대한
     * 정보들을 전부 가져와서 그중에 현재 실행 함수에서 가장 가까운 annotation을
     * 가져와서 override해줌.
     */
    const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [
      // 현재 Guard가 적용되어있는 문맥 상에서 ROLES_KEY을 기준으로 metadata를 가져올수 있음
      context.getHandler(),
      context.getClass(),
    ]);

    // Roles Annotation이 등록이 안되어 있는 경우
    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new UnauthorizedException('토근을 제공해 주세요!');
    }

    // 만약 사용자의 role과 설정한 role이 다른경우
    if (user.role !== requiredRole) {
      throw new ForbiddenException(
        `이 작업을 수행할 권한이 없습니다. ${requiredRole} 권한이 필요합니다.`,
      );
    }

    return true;
  }
}
