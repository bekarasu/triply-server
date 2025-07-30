import { BaseException } from './exception.base';
import { ExceptionCodes } from './exception.codes';

/**
 * Used to indicate that an argument was not provided (is empty object/array, null of undefined).
 *
 * @class ArgumentNotProvidedException
 */
export class ArgumentNotProvidedException extends BaseException {
  readonly code = ExceptionCodes.ArgumentsNotProvided;
}
