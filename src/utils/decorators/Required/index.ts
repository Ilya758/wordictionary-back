import { registerDecorator, ValidationOptions } from 'class-validator';

export const Required =
  (validationOptions?: ValidationOptions) =>
  (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'Required',
      target: object.constructor,
      propertyName,
      constraints: [propertyName],
      options: validationOptions,
      validator: {
        validate: (value: string) => !!value && typeof value === 'string',
      },
    });
  };
