import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler } from 'express';
import HttpCodes from '../common/enums/httpCodes';
import HttpException from '../exceptions/httpException';
import { TErrorConstraints } from '../common/enums/models/types/TErrorConstraints';

export default (
    type: ClassConstructor<object>,
    skipMissingProperties = false
  ): RequestHandler =>
  async (req, _, next) => {
    try {
      const errors = await validate(plainToInstance(type, req.body), {
        skipMissingProperties,
      });

      if (errors.length) {
        const message = errors
          .map((error: ValidationError) =>
            Object.values(<TErrorConstraints>error.constraints)
          )
          .join(', ');

        next(new HttpException(HttpCodes.BadRequest, message));
      } else {
        next();
      }
    } catch (error) {
      next(new HttpException(HttpCodes.InternalServerError, ''));
    }
  };
