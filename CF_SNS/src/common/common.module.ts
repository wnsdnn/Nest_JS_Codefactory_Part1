import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { POST_IMAGE_PATH, TEMP_FOLDER_PATH } from './const/path.const';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CommonController],
  exports: [CommonService],
  providers: [CommonService],
  imports: [
    AuthModule,
    UsersModule,
    // MulterModule 세팅
    MulterModule.register({
      limits: {
        // 바이트 단위로 입력
        fileSize: 1000000,
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(에러, boolean)
         *
         * 첫번째 파라미터에는 에러가 있을경우 에러 정보를 넣어준다.
         * 두번째 파라미터는 파일을 받을지 말지(다운로드) boolean을 넣어준다.
         */
        // xxx.jpg -> .jpg
        const ext = path.extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다!'),
            false,
          );
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          // 123456-1234856-1354-456
          cb(null, `${uuid()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  ],
})
export class CommonModule {}
