import { IId } from '../../common/enums/models/interfaces/IId';

export interface IWord extends IId {
  createdBy: string;
  description: string;
  group: string;
  name: string;
}
