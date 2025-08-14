import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Removed cookie parser - now using Authorization header

  // add prefix to all routes
  app.setGlobalPrefix('api');

  // add validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // add cors - removed credentials since we're using Authorization header
  app.enableCors({
    origin: ['http://192.168.2.145:3000', 'http://localhost:3000'],
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
}
bootstrap();
