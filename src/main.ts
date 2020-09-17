import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config();

const PORT = 8000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT);
}
bootstrap();
