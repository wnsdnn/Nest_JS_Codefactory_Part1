import {
  BadRequestException,
  CanActivate,
  ExecutionContext, ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RolesEnum } from '../../users/entity/const/foles.const';
import { PostsService } from '../posts.service';
import { Request } from 'express';
import { UsersModel } from '../../users/entity/users.entity';

@Injectable()
export class IsPostMineOrAdmin implements CanActivate {
  constructor(private readonly postService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request & {
      user: UsersModel;
    };

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('사용자 정보를 가져올 수 없습니다.');
    }

    /**
     * Admin일 경우 그냥 패스
     */
    if (user.role === RolesEnum.ADMIN) {
      return true;
    }

    // 파라미터에서 PostId값 가져오기
    // (/posts/:postId) <= 요런 URL일때 적용 시킬 가드라서 무조건 있어야함(post 수정, 삭제)
    const postId = req.params.postId;

    if (!postId) {
      throw new BadRequestException('Post ID가 파라미터로 제공되어야 합니다.');
    }

    const isOk = await this.postService.isPostMine(user.id, parseInt(postId));

    if (!isOk) {
      throw new ForbiddenException('권한이 없습니다.');
    }

    return true
  }
}
