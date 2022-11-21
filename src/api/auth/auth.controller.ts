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

export default class AuthController implements IController {
  public path = ControllerPaths.Auth;

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

    res.send(newUser.id);
  };
}
