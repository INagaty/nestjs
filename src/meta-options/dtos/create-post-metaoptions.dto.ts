import { IsJSON, IsNotEmpty } from 'class-validator';

export class createPostMetaOptionsDto {
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
