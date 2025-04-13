/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  Inject,
  forwardRef,
  RequestTimeoutException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { error } from 'console';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

/**
 * Class to connect to Users Table and preform Business Logic
 */
@Injectable()
export class UsersService {
  queryRunner: any;
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject()
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    private readonly dataSource: DataSource,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser;

    //Check Email
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to Process your request at the moment',
        { description: 'Error connecting to the database' },
      );
    }
    //Handle Exception
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    //Create User
    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to Process your request at the moment',
        { description: 'Error connecting to the database' },
      );
    }
    return newUser;
  }

  public findAll(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'This endpoint is deprecated',
      },
      HttpStatus.MOVED_PERMANENTLY,
    );
  }

  public async findOneById(id: number) {
    let user;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to Process your request at the moment',
        { description: 'Error connecting to the database' },
      );
    }
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.createMany(createManyUsersDto);
  }
}
