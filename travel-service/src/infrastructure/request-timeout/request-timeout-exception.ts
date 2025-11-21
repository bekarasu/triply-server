import { ErrorProtocol, InfrastructureException } from '@src/libs';
export class RequestTimeoutException extends InfrastructureException {
  code = 'REQUEST_TIMEOUT';
  httpCode = 400;
  message = 'Request Timeout';
}
