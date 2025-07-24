import { BaseException, ExceptionDetail } from '@src/libs';

export class InvalidAuthTokenException extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(detail?: ExceptionDetail) {
    super('Invalid auth token error');

    if (detail) {
      this.details.push(detail);
    }
  }
}
