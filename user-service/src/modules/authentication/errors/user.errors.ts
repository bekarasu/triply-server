import { BaseException } from '@libs';

export class UserExistError extends BaseException {
  code = 'USER_EXIST_ERROR';

  constructor(metadata?: unknown) {
    super('User already exists', metadata);
  }
}

export class UserNotExistError extends BaseException {
  code = 'USER_NOT_EXIST';

  constructor(metadata?: unknown) {
    super('User not exists', metadata);
  }
}

export class UserNotActiveError extends BaseException {
  code = 'USER_NOT_ACTIVE';

  constructor(metadata?: unknown) {
    super('User is not active', metadata);
  }
}

export class InvalidOtpTokenError extends BaseException {
  code = 'INVALID_OTP_TOKEN';

  constructor(metadata?: unknown) {
    super('Invalid OTP Token', metadata);
  }
}

export class AccountAlreadyLinkedException extends BaseException {
  code = 'ACCOUNT_ALREADY_LINKED';

  constructor(metadata?: unknown) {
    super('Account already linked', metadata);
  }
}

export class InvalidSelectedUserException extends BaseException {
  code = 'INVALID_SELECTED_USER';

  constructor(metadata?: unknown) {
    super('Selected user is invalid', metadata);
  }
}
