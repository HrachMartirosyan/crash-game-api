import fs, { WriteStream } from 'fs';

class DtoService {
  private readonly writeDir: string;
  private writeStream: WriteStream;

  constructor(writeDir: string) {
    this.writeDir = writeDir;
    this.writeStream = fs.createWriteStream(this.writeDir);
  }

  async archive(): Promise<void> {}
}

export default DtoService;
