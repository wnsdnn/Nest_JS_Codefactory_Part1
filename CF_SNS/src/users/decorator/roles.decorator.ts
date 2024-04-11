import { RolesEnum } from '../entity/const/foles.const';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'user_roles';

// @Roles(RolesEnum.ADMIN)
// 해당 코드처럼 사용하면 해당 api는 ADMIN만 사용할수 있게 만들 예정
export const Roles = (role: RolesEnum) => SetMetadata(ROLES_KEY, role);
