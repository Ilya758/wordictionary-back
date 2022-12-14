/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import HttpCodes from '../common/enums/httpCodes';
import HttpException from '../exceptions/httpException';

export default (
  error: HttpException,
  _: Request,
  response: Response,
  __: NextFunction
): void => {
  const { status } = error;
  const message = error.message || 'Something went wrong';

  response.status(status || HttpCodes.InternalServerError).send({
    message,
  });
};
