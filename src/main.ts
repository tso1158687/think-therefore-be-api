import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // TODO: Enable CORS in development mode
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
