import { BaseException, ExceptionDetail } from '@src/libs';

export class InvalidRegistrationTokenException extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(detail?: ExceptionDetail) {
    super('Invalid registration token error');

    detail && this.details.push(detail);
  }
}

export class InvalidLinkAccountTokenException extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(detail?: ExceptionDetail) {
    super('Invalid link account token error');

    detail && this.details.push(detail);
  }
}

export class InvalidSelectAccountTokenException extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(detail?: ExceptionDetail) {
    super('Invalid select account token error');

    detail && this.details.push(detail);
  }
}

export class TokenExpiredException extends BaseException {
  code = 'TOKEN_EXPIRED_ERROR';

  constructor(detail?: ExceptionDetail) {
    super('Token is expired');

    detail && this.details.push(detail);
  }
}

export class InvalidAuthTokenException extends BaseException {
  code = 'INVALID_TOKEN_ERROR';

  constructor(detail?: ExceptionDetail) {
    super('Invalid auth token error');

    detail && this.details.push(detail);
  }
}
