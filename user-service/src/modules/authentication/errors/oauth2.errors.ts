import { BaseException } from '@libs';

export class InvalidAuthorizationCodeError extends BaseException {
  code = 'INVALID_AUTHORIZARION_CODE';

  constructor(metadata?: unknown) {
    super('Invalid Authorization code', metadata);
  }
}

export class InvalidProviderError extends BaseException {
  code = 'INVALID_PROVIDER';

  constructor(metadata?: unknown) {
    super('Invalid Provider', metadata);
  }
}

export class InvalidTokenError extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(metadata?: unknown) {
    super('Invalid Token code', metadata);
  }
}
