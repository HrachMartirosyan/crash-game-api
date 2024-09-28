export abstract class DB {
  public abstract connect(): Promise<void>;
  public abstract disconnect(): Promise<void>;
}
