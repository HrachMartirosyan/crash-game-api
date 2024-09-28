export class BadRequest extends Error {
  public status: number = 400;
  public message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
