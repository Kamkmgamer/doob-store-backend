// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/enums/user-role.enum'; // Import the UserRole enum

export const ROLES_KEY = 'roles'; // A unique key to identify our metadata

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);