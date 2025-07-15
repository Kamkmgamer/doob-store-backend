// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Method to validate user credentials for login (used by LocalStrategy)
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) { // Only proceed if user is found
      const isPasswordValid = await (await import('bcryptjs')).compare(pass, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        // At this point, 'result' should contain id, username, email, and role from the DB.
        return result;
      }
    }
    return null; // Return null if user not found or password invalid
  }

  // Method for user login (generates JWT token)
  async login(user: any) { // 'user' here is the 'result' from validateUser, containing role
    // IMPORTANT: Include 'role' in the JWT payload
    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role, // <--- ADDED role to JWT payload
    };

    return {
      accessToken: this.jwtService.sign(payload),
      // IMPORTANT: Include 'role' (and 'email' if applicable) in the user object returned to frontend
      user: {
        id: user.id,
        username: user.username,
        email: user.email, // <--- ADDED email (if your User entity has it)
        role: user.role,   // <--- ADDED role to the user object for the frontend
      },
    };
  }

  // Method for user registration
  async register(createUserDto: CreateUserDto) {
    const existingUserByUsername = await this.usersService.findOneByUsername(createUserDto.username);
    if (existingUserByUsername) {
      throw new ConflictException('Username already taken');
    }

    const newUser = await this.usersService.create(createUserDto); // newUser should contain the default role

    // IMPORTANT: Include 'role' in the JWT payload for new user
    const payload = {
      username: newUser.username,
      sub: newUser.id,
      role: newUser.role, // <--- ADDED role to JWT payload for new user
    };

    return {
      accessToken: this.jwtService.sign(payload),
      // IMPORTANT: Include 'role' (and 'email' if applicable) in the new user object returned to frontend
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email, // <--- ADDED email
        role: newUser.role,   // <--- ADDED role
      },
    };
  }
}