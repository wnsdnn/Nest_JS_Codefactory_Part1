import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './entities/posts.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { ImageModel } from '../common/entity/iamge.entity';
import { PostsImagesService } from './image/images.service';

// 여기 선언하면 IocContainer가 인지할수 있음
@Module({
  imports: [
    // Repository를 만들때는 forFeature() 사용
    // TypeOrm이 자동으로 Repository를 생성해준다.
    TypeOrmModule.forFeature([PostsModel, ImageModel]),
    AuthModule,
    UsersModule,
    CommonModule,
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
  providers: [PostsService, PostsImagesService],
})
export class PostsModule {}
