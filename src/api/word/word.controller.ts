import { RequestHandler, Router } from 'express';
import { ErrorMessage } from '../../common/enums/errorMessage';
import HttpCodes from '../../common/enums/httpCodes';
import CreateWordDto from '../../common/enums/models/DTO/CreateWordDto';
import { IRequest } from '../../common/enums/models/interfaces/IRequest';
import { ControllerPaths } from '../../common/enums/paths';
import HttpException from '../../exceptions/httpException';
import authMiddleware from '../../middlewares/auth.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { WordService } from '../../services';

export default class WordController {
  public path = ControllerPaths.Word;

  public wordService = new WordService();

  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = (): void => {
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .get(`${this.path}/getAll`, this.getAllWords)
      .post(
        `${this.path}/create`,
        validationMiddleware(CreateWordDto),
        this.createWord
      )
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreateWordDto, true),
        this.updateWord
      )
      .delete(`${this.path}/:id`, this.deleteWord);
  };

  private getAllWords: RequestHandler = async (req, res, next) => {
    try {
      const { user } = req;

      if (user) {
        const words = await this.wordService.getAllWordsByUser(user._id);

        res.send(words);

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

  private createWord: RequestHandler = async (
    req: IRequest<CreateWordDto>,
    res,
    next
  ) => {
    try {
      const { body, user } = req;

      if (user) {
        const wordId = await this.wordService.createWord(body, user._id);

        res.status(HttpCodes.Created).send(wordId);

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

  private updateWord: RequestHandler = async (
    req: IRequest<CreateWordDto>,
    res,
    next
  ) => {
    try {
      const {
        body,
        params: { id },
        user,
      } = req;

      if (user) {
        await this.wordService.updateWord(id, body, user._id);

        res.sendStatus(HttpCodes.NoContent);

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

  private deleteWord: RequestHandler = async (req, res, next) => {
    try {
      await this.wordService.deleteWord(req.params.id);

      res.send(HttpCodes.NoContent);
    } catch (error) {
      next(error);
    }
  };
}
