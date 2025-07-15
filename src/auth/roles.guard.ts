// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/enums/user-role.enum'; 
import { ROLES_KEY } from './roles.decorator'; // Import the key from our decorator

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the metadata attached to the route handler
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(), // Check method handler (e.g., @Post() create())
      context.getClass(),   // Check controller class (e.g., @Controller('products'))
    ]);

    // If no specific roles are required for this route, allow access (JwtAuthGuard handles overall auth)
    if (!requiredRoles) {
      return true;
    }

    // 2. Get the authenticated user object from the request
    // (This 'user' object is populated by JwtAuthGuard and JwtStrategy)
    const { user } = context.switchToHttp().getRequest();

    // 3. Check if the user's role matches any of the required roles
    // 'some' returns true if at least one role matches
    return requiredRoles.some((role) => user.role === role);
  }
}