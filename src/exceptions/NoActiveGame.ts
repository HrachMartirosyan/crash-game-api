export class NoActiveGame extends Error {
  public status: number = 401;
  public message: string;

  constructor(message: string = 'No active game at this moment!') {
    super(message);
    this.message = message;
  }
}
