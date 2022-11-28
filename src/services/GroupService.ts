import { ErrorMessage } from '../common/enums/errorMessage';
import HttpCodes from '../common/enums/httpCodes';
import CreateWordGroupDto from '../common/enums/models/DTO/CreateWordGroupDto';
import { WordGroupErrorMessages } from '../exceptions/group';
import HttpException from '../exceptions/httpException';
import { IGroup } from '../models/group/group.interface';
import { GroupModel } from '../models/group/group.model';
import { IUser } from '../models/users/user.interface';
import { WordModel } from '../models/word/word.model';

export default class GroupService {
  public getAllWordGroups = async (): Promise<IGroup[]> => {
    try {
      return await GroupModel.find();
    } catch (error) {
      throw new HttpException(
        HttpCodes.BadRequest,
        ErrorMessage.InternalServerError
      );
    }
  };

  public createWordGroup = async (
    { name }: CreateWordGroupDto,
    user: IUser
  ): Promise<string> => {
    if (await GroupModel.findOne({ name }))
      throw new HttpException(
        HttpCodes.BadRequest,
        WordGroupErrorMessages.GroupNameHasAlreadyExist
      );

    const wordGroup = await GroupModel.create({ name, createdBy: user._id });

    return <string>wordGroup._id;
  };

  public updateWordGroup = async (
    _id: string,
    { name }: CreateWordGroupDto
  ): Promise<void> => {
    const wordGroup = await GroupModel.findOne({ _id });

    if (!wordGroup)
      throw new HttpException(
        HttpCodes.BadRequest,
        WordGroupErrorMessages.GroupNameNotExistOrDeleted
      );

    await GroupModel.updateOne(
      {
        _id,
      },
      {
        $set: {
          name,
        },
      }
    );
  };

  public deleteWordGroup = async (_id: string): Promise<void> => {
    const result = await GroupModel.findOneAndDelete({ _id });

    if (result) {
      const wordsForDeleting = await WordModel.find({ group: _id });

      if (wordsForDeleting.length) await WordModel.deleteMany({ group: _id });

      return;
    }

    throw new HttpException(
      HttpCodes.BadRequest,
      WordGroupErrorMessages.GroupNameNotExistOrDeleted
    );
  };
}
