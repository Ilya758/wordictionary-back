import { model, Schema } from 'mongoose';
import { IWord } from './word.interface';

const wordSchema = new Schema<IWord>(
  {
    name: String,
    createdBy: String,
    description: String,
    group: String,
  },
  {
    versionKey: false,
  }
);

export const WordModel = model<IWord & Document>('words', wordSchema);
