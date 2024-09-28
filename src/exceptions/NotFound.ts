export class NotFound extends Error {
  public status: number = 404;
  public message: string;

  constructor(message: string = 'Not found') {
    super(message);
    this.message = message;
  }
}
