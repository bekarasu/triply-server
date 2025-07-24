import { BaseException } from '@src/libs';

export class OtpExpiredError extends Error {
  constructor(message = 'OTP has expired') {
    super(message);
    this.name = 'OtpExpiredError';
  }
}

export class OtpNotFoundError extends Error {
  constructor(message = 'OTP not found') {
    super(message);
    this.name = 'OtpNotFoundError';
  }
}

export class InvalidOtpError extends BaseException {
  code = 'INVALID_OTP_ERROR';

  constructor() {
    super('Invalid OTP provided');
  }
}

export class OtpGenerationError extends Error {
  constructor(message = 'Failed to generate OTP') {
    super(message);
    this.name = 'OtpGenerationError';
  }
}

export class TooManyOtpAttemptsError extends Error {
  constructor(message = 'Too many OTP attempts. Please try again later') {
    super(message);
    this.name = 'TooManyOtpAttemptsError';
  }
}
