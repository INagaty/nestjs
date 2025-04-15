import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsJSON,
  IsISO8601,
  IsArray,
  ValidateNested,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

import { createPostMetaOptionsDto } from '../../meta-options/dtos/create-post-metaoptions.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  @MaxLength(512)
  title: string;

  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase and can only contain letters, numbers, and hyphens.',
  })
  @MaxLength(256)
  slug: string;

  @IsEnum(PostStatus)
  status: PostStatus;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsJSON()
  schema?: string;

  @IsOptional()
  @Matches(/^(https?:\/\/)(localhost|[\w.-]+)(:\d+)?(\/[\w./-]*)?$/, {
    message: 'featuredImageUrl must be a valid URL address',
  })
  @MaxLength(1024)
  featuredImageUrl?: string;

  @IsOptional()
  @IsISO8601()
  publishOn?: Date;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => createPostMetaOptionsDto)
  metaOptions: createPostMetaOptionsDto | null;
}
