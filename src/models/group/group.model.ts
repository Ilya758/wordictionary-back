import { Document, model, Schema } from 'mongoose';
import { IGroup } from './group.interface';

const groupSchema = new Schema<IGroup>(
  {
    name: String,
    createdBy: String,
  },
  {
    versionKey: false,
  }
);

export const GroupModel = model<IGroup & Document>('groups', groupSchema);
