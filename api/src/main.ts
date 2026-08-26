import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {rawBody: true});
  app.enableCors({origin: 'http://localhost:5173'})
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
