// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Import UpdateUserDto
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
      if (existingUser.email === email) {
        throw new ConflictException('Email already in use');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user === null ? undefined : user;
  }

  // Method to get a user by ID, explicitly omitting the password
  async getProfileById(id: string): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [ // Select all fields EXCEPT the password
        'id', 'username', 'email', 'firstName', 'middleName', 'lastName',
        'phoneNumber', 'streetAddress', 'city', 'stateProvince', 'postalCode', 'country'
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  // Method to update a user's profile
  async updateProfile(id: string, updateProfileDto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // Handle potential unique constraint violations for username/email
    if (updateProfileDto.username && updateProfileDto.username !== user.username) {
      const existingUser = await this.usersRepository.findOne({ where: { username: updateProfileDto.username } });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username already taken by another user.');
      }
    }
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({ where: { email: updateProfileDto.email } });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already taken by another user.');
      }
    }

    // Note: Password updates should ideally be handled by a separate method/endpoint
    // that verifies the old password for security reasons. We are not handling
    // password updates via this updateProfile method.

    // Merge the DTO changes into the user entity
    this.usersRepository.merge(user, updateProfileDto);
    const updatedUser = await this.usersRepository.save(user);

    // Return the updated user without the password
    const { password, ...result } = updatedUser;
    return result;
  }

  // Keep the original findOne for internal use or if needed for admin purposes
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}