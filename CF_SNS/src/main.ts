import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// nestJS를 실행하는 함수
async function bootstrap() {
  // AppModule이 여기서 사용
  // PostsModule > AppModule > main.ts
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
