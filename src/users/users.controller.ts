// src/users/users.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, // <-- Import Patch
  Param, 
  Delete, 
  HttpCode, 
  HttpStatus, 
  ParseUUIDPipe,
  UseGuards, // <-- Import UseGuards
  Request // <-- Import Request to access req.user
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // <-- Import UpdateUserDto
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // <-- Import JwtAuthGuard

@Controller('users') // Base route for this controller is /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @Get('me') // Endpoint to get the authenticated user's profile: GET /users/me
  getProfile(@Request() req: any) { // 'req' will have the 'user' object attached by JwtStrategy
    // req.user contains the payload from the JWT (id, username)
    return this.usersService.getProfileById(req.user.id);
  }

  @UseGuards(JwtAuthGuard) // Protect this endpoint
  @Patch('me') // Endpoint to update the authenticated user's profile: PATCH /users/me
  updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateUserDto) {
    // req.user contains the payload from the JWT (id, username)
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  // The original findOne is still here, but typically you would not expose
  // a /users/:id endpoint for general users without admin privileges.
  // It's kept for now, but consider removing it or adding admin guard later.
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // You might want to protect these CRUD operations for users too,
  // or only allow admins to perform them. For now, they are open.
  // @Patch(':id')
  // update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.usersService.update(id, updateProductDto);
  // }

  // @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.usersService.remove(id);
  // }
}