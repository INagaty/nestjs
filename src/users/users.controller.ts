import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseIntPipe,
  Headers,
  Ip,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/:id/{:optional}')
  public getUsers(
    @Param('id', ParseIntPipe) id: number | undefined,
    @Param('optional') optional?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    console.log(typeof id);
    console.log(typeof limit);
    console.log(optional);
    if (optional) {
      return `ID is ${id} and optional parameter is ${optional}`;
    } else {
      return `ID is ${id} and no optional parameter`;
    }
  }
  @Post()
  public createUser(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: any,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);
    return 'You sent a request to create user endpoint';
  }
}
