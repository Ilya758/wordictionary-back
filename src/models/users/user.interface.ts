import { IId } from '../../common/enums/models/interfaces/IId';

export interface IUser extends IId {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
