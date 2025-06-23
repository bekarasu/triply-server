export type ExceptionDetail =
	| {
			code: string
			// extends varying on errors
			[key: string]: any
	  }
	| BaseException

export interface SerializedException {
	message: string
	code: string
	stack?: string
	details?: ExceptionDetail[]
	metadata?: unknown

	/**
	 * ^ Consider adding optional `metadata` object to
	 * exceptions (if language doesn't support anything
	 * similar by default) and pass some useful technical
	 * information about the exception when throwing.
	 * This will make debugging easier.
	 */
}

export type ErrorProtocol = 'http' | 'grpc'

/**
 * Base class for custom exceptions.
 *
 * @abstract
 * @class BaseException
 * @extends {Error}
 */
export abstract class BaseException extends Error {
	details?: ExceptionDetail[] = []
	/**
	 * @param {string} message
	 * @param {ObjectLiteral} [metadata={}]
	 * **BE CAREFUL** not to include sensitive info in 'metadata'
	 * to prevent leaks since all exception's data will end up
	 * in application's log files. Only include non-sensitive
	 * info that may help with debugging.
	 */
	constructor(readonly message: string, readonly metadata?: unknown) {
		super(message)
		Error.captureStackTrace(this, this.constructor)
	}

	abstract code: string

	addDetail(detail: ExceptionDetail) {
		this.details.push(detail)
	}

	/**
	 * By default in NodeJS Error objects are not
	 * serialized properly when sending plain objects
	 * to external processes. This method is a workaround.
	 * Keep in mind not to return a stack trace to user when in production.
	 * https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
	 */
	toJSON(): SerializedException {
		return {
			code: this.code,
			message: this.message,
			metadata: this.metadata,
			details: this.details.map((detail) =>
				detail.toJSON ? detail.toJSON() : detail,
			),
		}
	}
}

/**
 * An abstract class for Infrastructure-level exceptions
 */
export abstract class InfrastructureException extends BaseException {
	abstract code: string
	/**
	 * Get protocol code of a specific protocol (http, gRPC, etc)
	 * @param protocol
	 */
	abstract getProtocolCode(protocol: ErrorProtocol): number | string
}
