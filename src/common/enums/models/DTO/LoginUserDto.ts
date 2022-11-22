import { IsString } from 'class-validator';

export default class LoginUserDto {
  @IsString()
  public email: string;

  @IsString()
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
