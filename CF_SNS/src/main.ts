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
    }),
  );

  await app.listen(3000);
}
bootstrap();
