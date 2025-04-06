/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';

/**
 * Class to connect to Users Table and preform Business Logic
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private userRepository: Repository<User>, // Replace with actual user repository type
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    //Check Email
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    //Handle Exceptions
    //Create User
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    const isAuth = this.authService.isAuthenticated('SAMPLE_TOKEN');
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  public findOneById(id: string) {
    return {
      id: 1234,
      firstName: 'John',
      email: 'john@doe.com',
    };
  }
}
