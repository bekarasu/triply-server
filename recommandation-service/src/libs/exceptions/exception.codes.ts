/**
 * Adding a `code` string with a custom status code for every
 * exception is a good practice, since when that exception
 * is transferred to another process `instanceof` check
 * cannot be performed anymore so a `code` string is used instead.
 * code enum types can be stored in a separate file so they
 * can be shared and reused on a receiving side
 */
export enum ExceptionCodes {
	EntityPropsInvalid = 'GENERIC.ENTITY_PROPS_INVALID',
	ArgumentsNotProvided = 'GENERIC.ARGUMENTS_NOT_PROVIDED',
	ArgumentsInvalid = 'GENERIC.ARGUMENTS_INVALID',
	InvalidRequestDataException = 'GENERIC.INVALID_REQUEST_DATA',
}
