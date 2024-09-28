export class Conflict extends Error {
  public status: number = 409;
  public message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
