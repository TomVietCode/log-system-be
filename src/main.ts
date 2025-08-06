import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // add prefix to all routes
  app.setGlobalPrefix("api")

  // add validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // add cors
  app.enableCors({  
  })
  
  await app.listen(process.env.PORT ?? 5000, '0.0.0.0');
}
bootstrap();
