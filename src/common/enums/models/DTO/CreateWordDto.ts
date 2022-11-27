import { MinLength } from 'class-validator';
import { WordErrorMessage } from '../../../../exceptions/word';
import { IWord } from '../../../../models/word/word.interface';
import { Required } from '../../../../utils/decorators/Required';
import { ValidationOptions } from '../../validationOptions';

export default class CreateWordDto implements Partial<IWord> {
  @MinLength(1, {
    message: WordErrorMessage.MinWordLength,
  })
  public name: string;

  @MinLength(ValidationOptions.minDescriptionLength, {
    message: WordErrorMessage.DescriptionMinLength,
  })
  public description: string;

  @Required({ message: WordErrorMessage.GroupIdRequired })
  public group: string;

  constructor(name: string, description: string, group: string) {
    this.name = name;
    this.description = description;
    this.group = group;
  }
}
