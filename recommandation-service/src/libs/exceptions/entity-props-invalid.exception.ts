import { BaseException } from './exception.base'
import { ExceptionCodes } from './exception.codes'

export class EntityPropsInvalidException extends BaseException {
	code: string = ExceptionCodes.EntityPropsInvalid
}
