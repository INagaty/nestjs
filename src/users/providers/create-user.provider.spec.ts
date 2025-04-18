/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserProvider } from './create-user.provider';
import { MailService } from 'src/mail/providers/mail.service';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { BadRequestException } from '@nestjs/common';

type MockRepsository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepsository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;
  let usersRespository: MockRepsository<User>;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'jogn@doe.com',
    password: 'password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,

        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        {
          provide: MailService,
          useValue: {
            sendUserWelcome: jest.fn(() => Promise.resolve()),
          },
        },
        {
          provide: HashingProvider,
          useValue: {
            hashPassword: jest.fn(() => user.password),
          },
        },
      ],
    }).compile();
    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRespository = module.get(getRepositoryToken(User));
  });

  it('Service should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('createUser', () => {
    describe('When a user doesnt exist', () => {
      it('should create a new user', async () => {
        usersRespository.findOne?.mockReturnValue(null);
        usersRespository.create?.mockReturnValue(user);
        usersRespository.save?.mockReturnValue(user);
        const newUser = await provider.createUser(user);
        expect(usersRespository.findOne).toHaveBeenCalledWith({
          where: { email: user.email },
        });
        expect(usersRespository.create).toHaveBeenCalledWith(user);
        expect(usersRespository.save).toHaveBeenCalledWith(user);
      });
    });
    describe('When a user does exists', () => {
      it('throw BadRequestException', async () => {
        usersRespository.findOne?.mockReturnValue(user.email);
        usersRespository.create?.mockReturnValue(user);
        usersRespository.save?.mockReturnValue(user);
        try {
          const newUser = await provider.createUser(user);
        } catch (error) {
          expect(error).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
