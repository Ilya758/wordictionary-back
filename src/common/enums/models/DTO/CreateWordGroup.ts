import { MinLength } from 'class-validator';
import { WordGroupErrorMessages } from '../../../../exceptions/group';

export default class CreateWordGroup {
  @MinLength(1, { message: WordGroupErrorMessages.MinWordGroupNameLength })
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}
