import { ErrorMessage } from '../common/enums/errorMessage';
import HttpCodes from '../common/enums/httpCodes';
import CreateWordDto from '../common/enums/models/DTO/CreateWordDto';
import { WordGroupErrorMessages } from '../exceptions/group';
import HttpException from '../exceptions/httpException';
import { WordErrorMessage } from '../exceptions/word';
import { GroupModel } from '../models/group/group.model';
import { IWord } from '../models/word/word.interface';
import { WordModel } from '../models/word/word.model';

export default class WordService {
  public getAllWordsByUser = async (createdBy: string): Promise<IWord[]> =>
    WordModel.find({ createdBy });

  public createWord = async (
    word: CreateWordDto,
    createdBy: string
  ): Promise<string> => {
    await this.checkGroupAndWordExistence(word);

    const { _id: id } = await WordModel.create({
      ...word,
      createdBy,
    });

    return id;
  };

  public updateWord = async (
    _id: string,
    word: CreateWordDto,
    userId: string
  ): Promise<void> => {
    const prevWord = await WordModel.findOne({ _id });

    if (prevWord) {
      const potentialErrorWord = await WordModel.findOne({ name: word.name });

      if (
        potentialErrorWord &&
        potentialErrorWord.name === word.name &&
        potentialErrorWord._id.toString() !== _id
      ) {
        throw new HttpException(
          HttpCodes.BadRequest,
          WordErrorMessage.WordNameNeedsToBeUnique
        );
      }

      const updatedWord = await WordModel.findOneAndUpdate(
        { _id },
        {
          ...word,
          userId,
        },
        {
          new: true,
        }
      );

      if (updatedWord) return;

      throw new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.InternalServerError
      );
    }

    throw new HttpException(
      HttpCodes.BadRequest,
      WordErrorMessage.WordNotExistOrDeleted
    );
  };

  public deleteWord = async (_id: string): Promise<void> => {
    if (!(await WordModel.findOneAndDelete({ _id })))
      throw new HttpException(
        HttpCodes.BadRequest,
        WordErrorMessage.WordNotExistOrDeleted
      );
  };

  private checkIfGroupExists = async (_id: string): Promise<boolean> =>
    !!(await GroupModel.findOne({ _id }));

  private checkIfWordExists = async (name: string): Promise<boolean> =>
    !!(await WordModel.findOne({ name }));

  private checkGroupAndWordExistence = async (
    word: CreateWordDto
  ): Promise<void> => {
    if (!(await this.checkIfGroupExists(word.group))) {
      throw new HttpException(
        HttpCodes.BadRequest,
        WordGroupErrorMessages.GroupNameNotExistOrDeleted
      );
    } else if (await this.checkIfWordExists(word.name))
      throw new HttpException(
        HttpCodes.BadRequest,
        WordErrorMessage.WordHasAlreadyExist
      );
  };
}
