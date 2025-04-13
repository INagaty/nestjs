/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepsository: Repository<User>,
  ) {}
  public async findOneByEmail(email: string) {
    let user: User | null;
    try {
      user = await this.userRepsository.findOneBy({ email });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error while fetching user by email',
      });
    }
    if (!user) {
      throw new UnauthorizedException('User not found with this email');
    }
    return user;
  }
}
