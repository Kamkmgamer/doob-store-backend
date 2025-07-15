// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service'; // Adjust path if necessary

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // The field name for username in your login request body
      passwordField: 'password', // The field name for password in your login request body
    });
  }

  async validate(username: string, password: string): Promise<any> {
    // This calls the validateUser method in your AuthService
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; // Return the user object (without password) if validation is successful
  }
}