import { BadRequestException, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';
import * as multer from 'multer';
import { POST_IMAGE_PATH } from '../common/const/path.const';
import { v4 as uuid } from 'uuid';

// 여기 선언하면 IocContainer가 인지할수 있음
@Module({
  imports: [
    // Repository를 만들때는 forFeature() 사용
    // TypeOrm이 자동으로 Repository를 생성해준다.
    TypeOrmModule.forFeature([PostsModel]),
    AuthModule,
    UsersModule,
    CommonModule,
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
          cb(null, POST_IMAGE_PATH);
        },
        filename: function (req, file, cb) {
          // 123456-1234856-1354-456
          cb(null, `${uuid()}${path.extname(file.originalname)}`);
        },
      }),
    }),
  ],
  exports: [PostsService],
  // controllers에 PostsController를 주입해주었기 때문에
  // 프로젝트에서 특정 url로 접근시 postsController를 실행해준다.
  controllers: [PostsController],
  // Controller에 의존성 주입 시킬 클래스들을 providers에 등록해줘야함.
  // providers안에 등록된 모든 클래스를 인스턴스화 없이 IocContainer에서
  // 의존하면서 사용할수 있게됨.
  // (providers에 등록해서 해당 클래스를 provider로 사용하고 싶다면
  // providers에 등록하는것 외에 해당 클래스에 @Injectable() 을 선언해줘야함!!)
  providers: [PostsService],
})
export class PostsModule {}
