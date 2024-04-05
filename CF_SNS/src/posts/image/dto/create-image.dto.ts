import { PickType } from '@nestjs/mapped-types';
import { ImageModel } from '../../../common/entity/iamge.entity';

export class CreatePostImageDto extends PickType(ImageModel, [
  'path',
  'post',
  'order',
  'post',
  'type',
]) {}
