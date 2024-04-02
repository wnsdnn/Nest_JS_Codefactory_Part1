import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModel } from './posts/entities/posts.entity';
import { UsersModule } from './users/users.module';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
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

@Module({
  // imports - 다른 모듈을 불러올때 사용
  imports: [
    PostsModule,
    UsersModule,
    // 외부에서 파일 접근 가능하게 만들기
    ServeStaticModule.forRoot({
      // 4022.jpg
      //
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
      entities: [PostsModel, UsersModel],
      synchronize: true,
    }),
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // NestJS에 모든 모듈에서 ClassSerializerIntercetor 적용
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
