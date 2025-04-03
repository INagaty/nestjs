/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public login(email: string, password: string, id: string) {
    //Check user exists
    const user = this.usersService.findOneById('1234');
    return 'SAMPLE_TOKEN';
  }

  public isAuthenticated(token: string) {
    //Check token is valid
    return true;
  }
}
