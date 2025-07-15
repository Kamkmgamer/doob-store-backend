// src\main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORS Configuration for Development and Production ---
  // Define allowed origins based on environment variables
  // For local development, this will be your frontend's dev server.
  // For production, this will be your deployed frontend's URL on Vercel.
  const allowedOrigins = [
    'http://localhost:5173', // Your frontend's development URL (Vite default)
    'http://localhost:3000', // Common for Create React App dev server or alternative
  ];

  // Add the production frontend URL from an environment variable (set on Render)
  if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }

  app.enableCors({
    origin: allowedOrigins, // Allow requests from specified origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow common HTTP methods
    credentials: true, // Allow cookies and authorization headers to be sent
  });
  // --- END CORS Configuration ---

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away properties not defined in DTOs
    forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are sent
    transform: true, // Automatically transform payloads to DTO instances
  }));

  console.log('NestJS application is starting up...');

  // Use process.env.PORT for deployment, fallback to 3000 for local dev
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`NestJS application has started and is listening on port ${port}!`);
  console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`); // For debugging
}
bootstrap();