/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler, Router } from 'express';
import { ErrorMessage } from '../../common/enums/errorMessage';
import HttpCodes from '../../common/enums/httpCodes';
import CreateWordGroup from '../../common/enums/models/DTO/CreateWordGroup';
import { IRequest } from '../../common/enums/models/interfaces/IRequest';
import { ControllerPaths } from '../../common/enums/paths';
import HttpException from '../../exceptions/httpException';
import authMiddleware from '../../middlewares/auth.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { GroupService } from '../../services';

export default class GroupController {
  public path = ControllerPaths.Group;

  public groupService = new GroupService();

  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(`${this.path}/getAll`, this.getAllWordGroups)
      .post(
        `${this.path}/create`,
        validationMiddleware(CreateWordGroup),
        this.createWordGroup
      )
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreateWordGroup, true),
        this.updateWordGroup
      )
      .delete(`${this.path}/:id`, this.deleteWordGroup);
  };

  private getAllWordGroups: RequestHandler = async (_, res, next) => {
    try {
      const groups = await this.groupService.getAllWordGroups();

      res.send(groups);
    } catch (error) {
      next(error);
    }
  };

  private createWordGroup: RequestHandler = async (
    req: IRequest<CreateWordGroup>,
    res,
    next
  ) => {
    const { body, user } = req;

    try {
      if (user) {
        const wordGroupId = await this.groupService.createWordGroup(body, user);

        res.status(HttpCodes.Created).send(wordGroupId);

        return;
      }

      throw new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.InternalServerError
      );
    } catch (error) {
      next(error);
    }
  };

  private updateWordGroup: RequestHandler = async (
    req: IRequest<CreateWordGroup>,
    res,
    next
  ) => {
    try {
      const {
        user,
        body,
        params: { id },
      } = req;

      if (user) {
        await this.groupService.updateWordGroup(id, body);

        res.sendStatus(HttpCodes.OK);

        return;
      }

      throw new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.InternalServerError
      );
    } catch (error) {
      next(error);
    }
  };

  private deleteWordGroup: RequestHandler = async (req, res, next) => {
    try {
      await this.groupService.deleteWordGroup(req.params.id);

      res.sendStatus(HttpCodes.NoContent);
    } catch (error) {
      next(error);
    }
  };
}
