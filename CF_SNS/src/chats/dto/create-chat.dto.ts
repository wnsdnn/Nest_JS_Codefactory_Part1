import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChatDto {
  @IsNumber({}, { each: true })
  userIds: number[];
}
