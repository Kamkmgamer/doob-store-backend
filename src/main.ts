// D:\projects\projects\doob-store\backend-ecommerce\src\main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  app.enableCors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow common HTTP methods
    credentials: true, // Allow cookies and authorization headers to be sent
  });

  // ADD THIS LINE (if not already there)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  console.log('NestJS application is starting up...');
  await app.listen(3000);
  console.log('NestJS application has started and is listening on port 3000!');
}
bootstrap();