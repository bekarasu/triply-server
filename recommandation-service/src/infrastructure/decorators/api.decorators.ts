import { HttpLoggingInterceptor } from '@infras/logger';
import {
  applyDecorators,
  Controller,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import {
  AllowUnauthorizedRequest,
  AuthenticationGuard,
  UserAPIAuthenticator,
} from '../authentication';
import { HttpExceptionFilter } from '../exception-filters';

export interface APIOptions {
  /**
   * @deprecated
   */
  logRequest?: boolean;
  path?: string;
  byPassAuthentication?: boolean;
  useSwagger?: boolean;
  applyForController?: boolean;
}

export interface UserAPIOptions extends APIOptions {
  bypassVerifyRequestToken?: true | boolean; // temporarily set to true
}

export type InternalAPIOptions = APIOptions;

export const UserAPI = (options: UserAPIOptions = {}) => {
  const { byPassAuthentication, useSwagger } = options;

  const decorators = [
    UseGuards(AuthenticationGuard(UserAPIAuthenticator)),
    UseFilters(HttpExceptionFilter),
    UseInterceptors(HttpLoggingInterceptor),
  ];

  if (byPassAuthentication) {
    decorators.push(AllowUnauthorizedRequest());
  }

  if (useSwagger) {
    decorators.push(
      ApiTags('Client'),
      ApiHeader({
        name: 'x-tracer-id',
      }),
    );
  }

  return applyDecorators(...decorators);
};

export const PublicAPI = () => {
  const decorators = [
    UseFilters(HttpExceptionFilter),
    UseInterceptors(HttpLoggingInterceptor),
  ];

  return applyDecorators(...decorators);
};

/* export const InternalAPI = (options: InternalAPIOptions) => {
  const { byPassAuthentication = false } = options;
  const decorators = [
    UseGuards(AuthenticationGuard(InternalAPIAuthenticator)),
    UseFilters(HttpExceptionFilter),
    UseInterceptors(HttpLoggingInterceptor),
    Controller({
      path: options.path,
      ...options,
    }),
  ] as any[];

  byPassAuthentication && decorators.push(AllowUnauthorizedRequest());

  // apply swagger
  if (options.useSwagger) {
    decorators.push(
      ApiTags('Internal'),
      ApiHeader({
        name: 'x-tracer-id',
      }),
    );
    !options.byPassAuthentication &&
      decorators.push(
        ApiHeader({
          name: 'x-server-key',
          required: true,
        }),
      );
  }

  return applyDecorators(...decorators);
}; */
