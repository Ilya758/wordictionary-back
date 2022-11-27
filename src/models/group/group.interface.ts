import { IId } from '../../common/enums/models/interfaces/IId';

export interface IGroup extends IId {
  name: string;
  createdBy: string;
}
