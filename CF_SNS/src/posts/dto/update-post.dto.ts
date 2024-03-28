import { CreatePostDto } from './create-post.dto';
import { IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';

// PartialType - create-post.dto.ts에서 사용한 PickType과 비슷한 함수인데
// required로 만드는 PickType과 달리 PartialType을 사용하게 되면
// Opstional(null 허용) 타입으로 값들을 받을수 있다.
export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  title?: string;

  @IsString({
    message: stringValidationMessage,
  })
  @IsOptional()
  content?: string;
}
