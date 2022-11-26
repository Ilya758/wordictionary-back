import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ErrorMessage } from '../common/enums/errorMessage';
import HttpCodes from '../common/enums/httpCodes';
import CreateUserDto from '../common/enums/models/DTO/CreateUserDto';
import { ITokenData } from '../common/enums/models/interfaces/token/ITokenData';
import * as config from '../config';
import HttpException from '../exceptions/httpException';
import { IUser } from '../models/users/user.interface';
import { UserModel } from '../models/users/user.model';
import { SALT_ROUNDS } from '../common/enums/saltRounds';
import LoginUserDto from '../common/enums/models/DTO/LoginUserDto';

const {
  default: { jwtSecret },
} = config;

export default class AuthenticationService {
  public register = async (
    userData: CreateUserDto
  ): Promise<{ cookie: string; user: IUser }> => {
    const { email, password } = userData;

    if (await UserModel.findOne({ email })) {
      throw new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.UserWithEmailAlreadyExists
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });
    const cookie = this.setCookie(this.createToken(user));

    return {
      cookie,
      user,
    };
  };

  public createToken = ({ _id }: IUser): ITokenData => {
    const expiresIn = 3600;

    return {
      expiresIn: 3600,
      token: jwt.sign({ _id }, String(jwtSecret), { expiresIn }),
    };
  };

  public login = async ({
    email,
    password,
  }: LoginUserDto): Promise<{
    isPasswordEquals: boolean;
    cookie: string;
    user: IUser;
  }> => {
    const user = await UserModel.findOne({ email });

    if (user) {
      const isPasswordEquals = await bcrypt.compare(password, user.password);
      const cookie = this.setCookie(this.createToken(user));

      return {
        cookie,
        isPasswordEquals,
        user,
      };
    }

    throw new HttpException(
      HttpCodes.BadRequest,
      ErrorMessage.InappropriateLoginCredentials
    );
  };

  private setCookie = ({ expiresIn, token }: ITokenData): string =>
    `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`;
}
