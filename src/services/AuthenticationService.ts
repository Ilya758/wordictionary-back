import jwt from 'jsonwebtoken';
import { IStoredToken } from '../common/enums/models/interfaces/token/IStoredToken';
import { ITokenData } from '../common/enums/models/interfaces/token/ITokenData';
import * as config from '../config';
import { IUser } from '../models/users/user.interface';

const {
  default: { jwtSecret },
} = config;

export default class AuthenticationService {
  public createToken = ({ _id }: IUser): ITokenData => {
    const expiresIn = 3600;
    const storedToken: IStoredToken = { _id };

    return {
      expiresIn,
      token: jwt.sign(storedToken, String(jwtSecret), { expiresIn }),
    };
  };
}
