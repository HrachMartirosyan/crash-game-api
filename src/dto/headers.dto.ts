import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class SessionHeaderDto {
  @Expose()
  @IsString()
  'session-id': string;
}
