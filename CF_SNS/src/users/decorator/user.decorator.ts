import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersModel } from '../entities/users.entity';

// AccessTokenGuard 가드와 같이 사용할 예정
export const User = createParamDecorator(
  // data - 현재 코드에서 data의 값은 User에 있는 속성들의 값만 받을수 있음
  (data: keyof UsersModel | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as UsersModel;

    if (!user) {
      throw new InternalServerErrorException(
        'User 데코레이터는 AccessTokenGuard와 함께 사용해야합니다. Request에 user 프로퍼티가 존재하지 않습니다!',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
