// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum'; // <-- Import UserRole enum

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  // Update payload type to include 'role'
  async validate(payload: { sub: string; username: string; role: UserRole }) { 
    // Fetch the full user object, ensuring role is available
    const user = await this.usersService.findOne(payload.sub); 
    if (!user) {
      throw new UnauthorizedException('User not found or token invalid');
    }

    // Attach the user object (excluding password) and its role to the request.
    // This object will be available as 'req.user' in your controllers.
    const { password, ...result } = user; 
    return { ...result, role: user.role }; // <-- Ensure role is explicitly returned
  }
}