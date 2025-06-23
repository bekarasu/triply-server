import { BaseException } from './exception.base'
import { ExceptionCodes } from './exception.codes'

/**
 * Used to indicate that an incorrect argument was provided to a method/function/class constructor
 *
 * @class ArgumentInvalidException
 * @extends {ExceptionBase}
 */
export class ArgumentInvalidException extends BaseException {
	readonly code = ExceptionCodes.ArgumentsInvalid
}
