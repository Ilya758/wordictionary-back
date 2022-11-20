export default class HttpException extends Error {
  public status: number;

  constructor(public status: number, public message: string) {
    super(message);
  }
}
