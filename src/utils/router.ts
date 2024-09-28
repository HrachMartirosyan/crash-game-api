import { plainToInstance } from 'class-transformer';

export function exposedPlainToInstance(dto: any, value: any): typeof dto {
  return plainToInstance(dto as any, value, {
    excludeExtraneousValues: true,
  });
}
