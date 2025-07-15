// backend-ecommerce/src/auth/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core'; // Make sure Reflector is imported
import { IS_PUBLIC_KEY } from './public.decorator'; // Import IS_PUBLIC_KEY

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { // Inject Reflector
    super();
  }

  canActivate(context: ExecutionContext) {
    // Corrected: Use getAllAndOverride instead of getAllMetadata
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true; // Allow access if @Public() decorator is present
    }
    // If not public, then apply the JWT authentication logic
    return super.canActivate(context);
  }
}