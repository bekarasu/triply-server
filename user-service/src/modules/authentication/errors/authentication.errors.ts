import { BaseException } from '@src/libs';

export class UserAccountIsNotAssociateException extends BaseException {
  code = 'USER_ACCOUNT_NOT_ASSOCIATE';

  constructor() {
    super('User account is not associatable');
  }
}

export class PhoneNumberExistsException extends BaseException {
  code = 'PHONE_NUMBER_CONFLICT_ERROR';

  constructor() {
    super('Phone number already exists');
  }
}

export class EmailNotValidatedException extends BaseException {
  code = 'EMAIL_NOT_VALIDATED_ERROR';

  constructor() {
    super('Email is not validated');
  }
}

export class AccountLinkedNotAllowedException extends BaseException {
  code = 'ACCOUNT_LINK_NOT_ALLOWED';

  constructor() {
    super('This account is not allowed to link');
  }
}

export class AccountMergedNotAllowedException extends BaseException {
  code = 'ACCOUNT_MERGED_NOT_ALLOWED';

  constructor() {
    super('Cannot merge account');
  }
}

export class InvalidCredentialsError extends BaseException {
  code = 'INVALID_CREDENTIALS_ERROR';

  constructor() {
    super('Invalid email or password');
  }
}

export class EmailAlreadyVerifiedError extends BaseException {
  code = 'EMAIL_ALREADY_VERIFIED_ERROR';

  constructor() {
    super('Email is already verified');
  }
}
