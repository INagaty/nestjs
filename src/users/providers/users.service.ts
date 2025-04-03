/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

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
