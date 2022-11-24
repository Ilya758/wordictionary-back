import { RequestHandler, Router } from 'express';
import bcrypt from 'bcrypt';
import { ErrorMessage } from '../../common/enums/errorMessage';
import HttpCodes from '../../common/enums/httpCodes';
import CreateUserDto from '../../common/enums/models/DTO/CreateUserDto';
import { IController } from '../../common/enums/models/interfaces/IController';
import { IRequest } from '../../common/enums/models/interfaces/IRequest';
import { ControllerPaths } from '../../common/enums/paths';
import HttpException from '../../exceptions/httpException';
import validationMiddleware from '../../middlewares/validation.middleware';
import { UserModel } from '../../models/users/user.model';
import { SALT_ROUNDS } from '../../common/enums/saltRounds';
import LoginUserDto from '../../common/enums/models/DTO/LoginUserDto';
import { ITokenData } from '../../common/enums/models/interfaces/token/ITokenData';
import { AuthenticationService } from '../../services';

export default class AuthController implements IController {
  public path = ControllerPaths.Auth;

  public authService = new AuthenticationService();

  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LoginUserDto),
      this.login
    );
    this.router.get(`${this.path}/logout`, this.logout);
  };

  private register: RequestHandler = async (
    req: IRequest<CreateUserDto>,
    res,
    next
  ): Promise<void> => {
    const { body } = req;
    const { email, password } = body;

    if (await UserModel.findOne({ email })) {
      next(
        new HttpException(
          HttpCodes.BadRequest,
          ErrorMessage.UserWithEmailAlreadyExists
        )
      );

      return;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await UserModel.create({
      ...body,
      password: hashedPassword,
    });
    const tokenData = this.authService.createToken(newUser);

    res.set('Set-Cookie', [this.setCookie(tokenData)]);
    res.send(newUser.id);
  };

  private login: RequestHandler = async (
    req: IRequest<LoginUserDto>,
    res,
    next
  ) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    const callLoginErrorException = (): void =>
      next(
        new HttpException(
          HttpCodes.BadRequest,
          ErrorMessage.InappropriateLoginCredentials
        )
      );

    if (user) {
      const isPasswordEquals = await bcrypt.compare(password, user.password);
      const tokenData = this.authService.createToken(user);

      res.set('Set-Cookie', [this.setCookie(tokenData)]);

      if (isPasswordEquals) {
        res.send(user.id);
      } else {
        callLoginErrorException();
      }
    } else {
      callLoginErrorException();
    }
  };

  private logout: RequestHandler = (_, res) => {
    res.set('Set-Cookie', ['Authorization=; Max-Age=0']);
    res.sendStatus(HttpCodes.OK);
  };

  private setCookie = ({ expiresIn, token }: ITokenData): string =>
    `Authorization=${token}; HttpOnly; Max-Age=${expiresIn}`;
}
