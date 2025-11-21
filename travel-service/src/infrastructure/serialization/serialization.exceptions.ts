import { ValidationError } from '@nestjs/common';
import { InfrastructureException } from '../../libs/exceptions';

export class InvalidRequestDataException extends InfrastructureException {
  code = 'INVALID_PARAMS';
  httpCode = 422;
  messages: string[] = [];

  constructor(validationErrors: ValidationError[]) {
    super('Invalid request data');
    validationErrors.forEach((error) => {
      this.getValidationMessages(error);
    });
  }

  protected getValidationMessages(error: ValidationError): void {
    if (error.children.length) {
      error.children.forEach((childError) => {
        this.getValidationMessages(childError);
      });
      return;
    }
    this.addDetail({
      code: 'PARAM_VALIDATION_ERROR',
      target: error.target,
      validationErrorMessages: Object.values(error.constraints),
    });
  }
}
