
import { Request, Response } from 'express';
import HttpCodes from '../common/enums/httpCodes';
import HttpException from '../exceptions/httpException';

export default (error: HttpException, _: Request, response: Response): void => {
  const status = error.status || HttpCodes.InternalServerError;
  const message = error.message || 'Something went wrong';
  
  response.status(status).send({
    message,
    status,
  });
};
