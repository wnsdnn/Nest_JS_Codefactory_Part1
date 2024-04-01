import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// nestJS를 실행하는 함수
async function bootstrap() {
  // AppModule이 여기서 사용
  // PostsModule > AppModule > main.ts
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // dto의 default값들을 넣은채로 인스턴스를 생성해도 괜찮다는 Emt
      transform: true,
      // transform이 될때 class Validation를 기반으로
      // 타입에 맞는 값으로 변경
      transformOptions: {
        // 임의로 변하는걸 허용한다
        enableImplicitConversion: true,
      },
      // Vaildator 데코레이션인 적용되지 않는 속성들을 삭제함
      whitelist: true,
      // Vaildator 데코레이션이 적용되지 않은 값을 보낼때 에러를 던진다
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
