import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRoles } from 'src/common/types';

export interface UserPayload {
  id: number;
  email: string;
  username: string;
  type: UserRoles;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);
