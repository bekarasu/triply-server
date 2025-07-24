import { Module, ValidationPipe } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { InvalidRequestDataException } from './serialization.exceptions'

@Module({
	imports: [],
	providers: [
		{
			provide: APP_PIPE,
			useFactory: () =>
				new ValidationPipe({
					transform: true,
					forbidUnknownValues: false,
					exceptionFactory: (errors) =>
						new InvalidRequestDataException(errors),
				}),
		},
	],
})
export class SerializationModule {}
