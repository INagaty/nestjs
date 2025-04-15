/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokensProvider } from './refresh-tokens.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly signInProvder: SignInProvider,

    private readonly refreshTokenProvider: RefreshTokensProvider,
  ) {}
  public async signin(signInDto: SignInDto) {
    return await this.signInProvder.signIn(signInDto);
  }

  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshTokens(refreshTokenDto);
  }

  public isAuthenticated(token: string) {
    //Check token is valid
    return true;
  }
}
