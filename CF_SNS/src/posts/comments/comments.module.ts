import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsModel } from './entity/comments.entity';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { PostExistsMiddleware } from './middleware/post-exists.middleware';
import { PostsModule } from '../posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsModel]),
    CommentsModule,
    CommonModule,
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  exports: [CommentsService],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PostExistsMiddleware)
      // 적용하고 싶은 Controller를 통으로 넣어줘도 됨
      .forRoutes(CommentsController);
  }
}
