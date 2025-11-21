import { InfrastructureException } from '@src/libs';

export class InvalidAccessTokenException extends InfrastructureException {
  code = 'INVALID_ACCESS_TOKEN';
  httpCode = 401;
  message = 'Invalid access token error';
}

export class MissingAccessTokenException extends InfrastructureException {
  code = 'MISSING_ACCESS_TOKEN';
  httpCode = 400;
  message = 'Missing access token error';
}

export class AccessTokenExpiredException extends InfrastructureException {
  code = 'ACCESS_TOKEN_EXPIRED';
  httpCode = 401;
  message = 'Access token expired error';
}

export class InvalidUserProviderException extends InfrastructureException {
  code = 'INVALID_USER_PROVIDER';
  httpCode = 401;
  message = 'Invalid user provider error';
}

export class InvalidServerKeyException extends InfrastructureException {
  code = 'INVALID_SERVER_KEY';
  httpCode = 401;
  message = 'Invalid server key error';
}

export class MissingServerKeyException extends InfrastructureException {
  code = 'MISSING_SERVER_KEY';
  httpCode = 400;
  message = 'Missing server key error';
}
