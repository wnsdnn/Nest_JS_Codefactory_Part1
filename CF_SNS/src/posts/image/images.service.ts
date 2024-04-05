import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageModel } from '../../common/entity/iamge.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CreatePostImageDto } from './dto/create-image.dto';
import * as path from 'path';
import {
  POST_IMAGE_PATH,
  TEMP_FOLDER_PATH,
} from '../../common/const/path.const';
import { promises } from 'fs';

@Injectable()
export class PostsImagesService {
  constructor(
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
  ) {}

  // 쿼리 러너 사용시 쿼리 러너에서 Repository를
  // 받을수 있도록 Repository를 반환하는 함수
  //
  // 만약 쿼리 러너가 없으면 그냥 일반 Repository 반환
  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ImageModel>(ImageModel)
      : this.imageRepository;
  }

  async createPostImage(dto: CreatePostImageDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    // dto의 이미지 이름을 기반으로
    // 파일의 경로를 생성한다.
    const tempFilePath = path.join(TEMP_FOLDER_PATH, dto.path);

    try {
      // promises 함수 안에 함수들은 모두 비동기
      // access - 해당 경로의 파일에 접근이 가능한지(존재하는지 확인)
      // 만약존재하지 않으면 에러를 던짐
      await promises.access(tempFilePath);
    } catch (e) {
      throw new BadRequestException('존재하지 않는 파일입니다.');
    }

    // 파일의 이름만 가져오기
    // basename - 해당 경로의 파일명만 가져오기
    const fileName = path.basename(tempFilePath);

    // 새로 이동할 posts 폴더의 경로 + 이미지 이름
    // {프로젝트 경로}/public/posts/asdf.jpg
    const newPath = path.join(POST_IMAGE_PATH, fileName);

    // save
    const result = await repository.save({
      ...dto,
    });

    // 파일 옮기기
    // 첫번째 파라미터의 경로에서 두번째 파라미터의 경로로 옮기기
    await promises.rename(tempFilePath, newPath);

    return result;
  }
}
