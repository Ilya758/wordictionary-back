import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorMessage } from '../common/enums/errorMessage';
import HttpCodes from '../common/enums/httpCodes';
import { IUserCookies } from '../common/enums/models/interfaces/IUserCookies';
import { IStoredToken } from '../common/enums/models/interfaces/token/IStoredToken';

import config from '../config';
import HttpException from '../exceptions/httpException';
import { UserModel } from '../models/users/user.model';

const { jwtSecret } = config;

export default async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const cookies = <IUserCookies>req.cookies;

  const generateWrongAuthTokenException = (): void => {
    next(
      new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.WrongAuthenticationToken
      )
    );
  };

  if (cookies && cookies.Authorization) {
    try {
      const { _id: id } = <IStoredToken>(
        jwt.verify(cookies.Authorization, String(jwtSecret))
      );

      const user = await UserModel.findOne({ id });

      if (user) {
        req.user = user;

        next();
      } else generateWrongAuthTokenException();
    } catch (error) {
      generateWrongAuthTokenException();
    }
  } else {
    next(
      new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.AuthenticationTokenMissing
      )
    );
  }
};
