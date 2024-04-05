import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/posts.entity';
import { IsOptional, IsString } from 'class-validator';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, PartialType -> 값을 반환

export class CreatePostDto extends PickType(PostsModel, ['title', 'content']) {
  // each - 리스트라는 뜻
  @IsString({
    each: true,
  })
  @IsOptional()
  images: string[] = [];
}
