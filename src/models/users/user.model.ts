import { Document, model, Schema } from 'mongoose';
import { IUser } from './user.interface';

const userSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
  },
  { versionKey: false }
);

export const UserModel = model<IUser & Document>('users', userSchema);
