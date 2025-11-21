import { ServiceException } from '@src/libs';

export class InvalidCityException extends ServiceException {
  code = 'INVALID_CITY';
  httpCode = 400;
  messages = 'Some of selected cities are invalid.';
}
