import { ErrorProtocol, InfrastructureException } from '@src/libs';

export class InvalidAccessTokenException extends InfrastructureException {
  code = 'INVALID_ACCESS_TOKEN';
  constructor(message = 'Invalid access token error') {
    super(message);
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 401;
    }
    return this.code;
  }
}

export class MissingAccessTokenException extends InfrastructureException {
  code = 'MISSING_ACCESS_TOKEN';
  constructor() {
    super('Mising access token error');
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 400;
    }
    return this.code;
  }
}

export class AccessTokenExpiredException extends InfrastructureException {
  code = 'ACCESS_TOKEN_EXPIRED';
  constructor() {
    super('Access token expired error');
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 401;
    }
    return this.code;
  }
}

export class InvalidUserProviderException extends InfrastructureException {
  code = 'INVALID_USER_PROVIDER';
  constructor() {
    super('Invalid user provider');
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 401;
    }
    return this.code;
  }
}

export class InvalidServerKeyException extends InfrastructureException {
  code = 'INVALID_SERVER_KEY';
  constructor() {
    super('Invalid server key');
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 401;
    }
    return this.code;
  }
}

export class MissingServerKeyException extends InfrastructureException {
  code = 'MISSING_SERVER_KEY';
  constructor() {
    super('Missing server key');
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 401;
    }
    return this.code;
  }
}
