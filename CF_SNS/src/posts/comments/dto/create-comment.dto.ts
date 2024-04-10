import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  post: number;

  @IsString()
  comment: string;
}
