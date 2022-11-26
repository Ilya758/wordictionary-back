import { RequestHandler, Router } from 'express';
import { ErrorMessage } from '../../common/enums/errorMessage';
import HttpCodes from '../../common/enums/httpCodes';
import CreateUserDto from '../../common/enums/models/DTO/CreateUserDto';
import { IController } from '../../common/enums/models/interfaces/IController';
import { IRequest } from '../../common/enums/models/interfaces/IRequest';
import { ControllerPaths } from '../../common/enums/paths';
import HttpException from '../../exceptions/httpException';
import validationMiddleware from '../../middlewares/validation.middleware';
import LoginUserDto from '../../common/enums/models/DTO/LoginUserDto';
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
    try {
      const { cookie, user } = await this.authService.register(req.body);

      res.set('Set-Cookie', [cookie]);
      res.send(user._id);
    } catch (error) {
      next(error);
    }
  };

  private login: RequestHandler = async (
    req: IRequest<LoginUserDto>,
    res,
    next
  ) => {
    try {
      const { cookie, isPasswordEquals, user } = await this.authService.login(
        req.body
      );

      if (isPasswordEquals) {
        res.set('Set-Cookie', [cookie]);
        res.send(user._id);

        return;
      }

      throw new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.InappropriateLoginCredentials
      );
    } catch (error) {
      next(error);
    }
  };

  private logout: RequestHandler = (_, res) => {
    res.set('Set-Cookie', ['Authorization=; Max-Age=0']);
    res.sendStatus(HttpCodes.OK);
  };
}
