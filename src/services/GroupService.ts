import { ErrorMessage } from '../common/enums/errorMessage';
import HttpCodes from '../common/enums/httpCodes';
import CreateWordGroup from '../common/enums/models/DTO/CreateWordGroup';
import { WordGroupErrorMessages } from '../exceptions/group';
import HttpException from '../exceptions/httpException';
import { IGroup } from '../models/group/group.interface';
import { GroupModel } from '../models/group/group.model';
import { IUser } from '../models/users/user.interface';

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
    { name }: CreateWordGroup,
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
    { name }: CreateWordGroup
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

    if (result) return;

    throw new HttpException(
      HttpCodes.BadRequest,
      WordGroupErrorMessages.GroupNameNotExistOrDeleted
    );
  };
}
