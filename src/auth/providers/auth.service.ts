/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvder: SignInProvider,
  ) {}
  public async signin(signInDto: SignInDto) {
    return await this.signInProvder.signIn(signInDto);
  }

  public isAuthenticated(token: string) {
    //Check token is valid
    return true;
  }
}
