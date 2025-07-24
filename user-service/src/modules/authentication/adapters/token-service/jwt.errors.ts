import { BaseException } from '@src/libs';

export class InvalidTokenError extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(metadata?: unknown) {
    super('Invalid Token Error', metadata);
  }
}
