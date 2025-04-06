/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class GetUsersParamDto {
  @ApiPropertyOptional({
    description: 'Get User with specific ID',
    example: 1234,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id?: number;
}
