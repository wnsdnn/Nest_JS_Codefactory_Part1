import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entity/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entity/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import {
  ENV_DB_DATABASE_KEY,
  ENV_DB_HOST_KEY,
  ENV_DB_PASSWORD_KEY,
  ENV_DB_PORT_KEY,
  ENV_DB_USERNAME_KEY,
} from './common/const/env-keys.const';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';
import { ImageModel } from './common/entity/iamge.entity';
import { LogMiddleware } from './common/middleware/log.middleware';
import { ChatsModule } from './chats/chats.module';
import { ChatsModel } from './chats/entity/chats.entity';
import { MessagesModel } from './chats/messages/entity/message.entity';
import { CommentsModule } from './posts/comments/comments.module';
import { CommentsModel } from './posts/comments/entity/comments.entity';
import { RolesGuard } from './users/guard/roles.guard';
import { AccessTokenGuard } from './auth/guard/bearer-token.guard';
import { UserFollowersModel } from './users/entity/user-followers.entity';

@Module({
  // imports - 다른 모듈을 불러올때 사용
  imports: [
    PostsModule,
    UsersModule,
    // 외부에서 파일 접근 가능하게 만들기
    ServeStaticModule.forRoot({
      // http://localhost:3000/public/posts/4003.jpg
      // http://localhost:3000/posts/4003.jpg
      rootPath: PUBLIC_FOLDER_PATH,
      // root값 앞에 추가
      serveRoot: '/public',
    }),
    // env 파일 적용
    ConfigModule.forRoot({
      envFilePath: '.env',
      // 각 모듈별 자동 import 시키기
      isGlobal: true,
    }),
    // postgres 연결
    TypeOrmModule.forRoot({
      // 데이터베이스 타입
      type: 'postgres',
      // process - 환경변수값을 가져올수 있음
      host: process.env[ENV_DB_HOST_KEY],
      port: parseInt(process.env[ENV_DB_PORT_KEY]),
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      // entity를 등록
      entities: [
        PostsModel,
        UsersModel,
        ImageModel,
        ChatsModel,
        MessagesModel,
        CommentsModel,
        UserFollowersModel,
      ],
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
    ChatsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // NestJS에 모든 모듈에서 ClassSerializerIntercetor 적용
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      // 이런식으로 app 전체에다가 등록하면 해당 Guard가 젤 먼저 실행된다
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
// Middleware는 다른 것들과 다르게 module 파일에서 적용
// NestModule implements
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // 미들웨어 적용하기
    consumer.apply(LogMiddleware).forRoutes({
      // path 뒤에 *를 넣으면 그뒤에 어떤 글자가 와도 상관없다는 표시가 됨 (posts*)
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
