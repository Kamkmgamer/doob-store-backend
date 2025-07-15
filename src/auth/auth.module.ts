// src/auth/auth.module.ts (Full updated content)
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy'; // <-- NEW: Import LocalStrategy

@Module({
  imports: [
    UsersModule,
    PassportModule, // No specific configuration for PassportModule.register() needed here for local strategy
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    // ConfigModule.forRoot({ isGlobal: true }), // Only if not in app.module.ts (recommended to be in app.module)
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy, // <-- NEW: Add LocalStrategy here
  ],
  exports: [AuthService],
})
export class AuthModule {}