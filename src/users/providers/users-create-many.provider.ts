import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}
  public async createMany(createManyUsersDto: CreateManyUsersDto) {
    const newUsers: User[] = [];
    //Create Query Runner Instance
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      //Connect Instance to Datasource
      await queryRunner.connect();
      //Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Error connecting to database, please try again later',
      );
    }

    //If Successful, commit transaction
    try {
      for (const user of createManyUsersDto.users) {
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
        //If Successful, commit transaction
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      //If Failed, rollback transaction
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ConflictException(
        'Error creating users, please try again later',
        {
          description: String(error),
        },
      );
    } finally {
      try {
        //Release Query Runner
        await queryRunner.release();
      } catch (error) {
        // eslint-disable-next-line no-unsafe-finally
        throw new RequestTimeoutException('Error releasing query runner', {
          description: String(error),
        });
      }
    }
    return { users: newUsers };
  }
}
