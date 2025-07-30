import { ErrorProtocol, InfrastructureException } from '@src/libs';
export class RequestTimeoutException extends InfrastructureException {
  code = 'REQUEST_TIMEOUT';
  constructor(message = 'Request Timeout') {
    super(message);
  }

  getProtocolCode(protocol: ErrorProtocol): string | number {
    switch (protocol) {
      case 'http':
        return 400;
    }
    return this.code;
  }
}
