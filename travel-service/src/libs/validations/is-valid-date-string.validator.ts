import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const IsValidDateString = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidDateString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          // Check format YYYY-MM-DD
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!dateRegex.test(value)) return false;

          // Check if it's a valid date
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;

          // Verify the date components match the input to catch invalid dates like 2025-13-01
          const [year, month, day] = value.split('-').map(Number);
          return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
          );
        },
        defaultMessage(args: ValidationArguments) {
          return 'Start date must be a valid date in- YYYY-MM-DD format';
        },
      },
    });
  };
};
