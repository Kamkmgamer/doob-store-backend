// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode, // Added for clarity, though not strictly necessary if default is 200/201
  HttpStatus, // Added for clarity
} from '@nestjs/common';
import { AuthService } from './auth.service'; // Correct import for your AuthService
import { AuthGuard } from '@nestjs/passport'; // For local strategy in login
import { JwtAuthGuard } from './jwt-auth.guard'; // Your JWT guard
import { CreateUserDto } from '../users/dto/create-user.dto'; // Ensure this path is correct
// import { LoginUserDto } from './dto/login-user.dto'; // Uncomment if you have a specific DTO for login input

// Define a custom interface for the request object to include 'user' property
// This helps TypeScript understand the structure of req.user after authentication
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
    // Add any other user properties you expect to be attached to req.user by your guards
  };
}

@Controller('auth')
export class AuthController { // Ensure 'export' is here
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED) // Returns 201 Created on successful registration
  async register(@Body() createUserDto: CreateUserDto) {
    // Delegates the registration logic to AuthService
    return this.authService.register(createUserDto);
  }

  @UseGuards(AuthGuard('local')) // This guard will validate credentials and attach user to req.user
  @Post('login')
  @HttpCode(HttpStatus.OK) // Returns 200 OK on successful login
  async login(@Req() req: AuthenticatedRequest) {
    // Delegates the login (token generation) logic to AuthService, passing the validated user
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard) // This guard protects the profile endpoint, validating the JWT
  @Get('profile')
  @HttpCode(HttpStatus.OK) // Returns 200 OK
  getProfile(@Req() req: AuthenticatedRequest) {
    // Returns the user object attached to req by the JwtAuthGuard
    return { user: req.user };
  }
}