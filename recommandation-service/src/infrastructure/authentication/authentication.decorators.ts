import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { BY_PASS_AUTHENTICATION_METADATA } from './authentication.guard';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.auth.user;
  },
);

export const AllowUnauthorizedRequest = () =>
  SetMetadata(BY_PASS_AUTHENTICATION_METADATA, true);
