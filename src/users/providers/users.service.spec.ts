/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleIdProvider } from './find-one-by-google-id.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UsersService', () => {
  const mockCreateUserProvider: Partial<CreateUserProvider> = {
    createUser: (createUserDto: CreateUserDto) =>
      Promise.resolve({
        id: 12,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName ?? '',
        email: createUserDto.email,
        password: createUserDto.password,
      }),
  };
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
        { provide: FindOneByGoogleIdProvider, useValue: {} },
        { provide: FindOneUserByEmailProvider, useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('Should be defined', () => {
      expect(service.createUser).toBeDefined();
    });
    it('Should call createUser on createUserProvider', async () => {
      const user = await service.createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        password: 'password',
      });
      expect(user.firstName).toEqual('John');
    });
  });
});
