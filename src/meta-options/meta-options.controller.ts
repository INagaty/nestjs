import { Controller, Post, Body } from '@nestjs/common';
import { createPostMetaOptionsDto } from './dtos/create-post-metaoptions.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}
  @Post()
  public create(@Body() createPostMetaOptionsDto: createPostMetaOptionsDto) {
    return this.metaOptionsService.create(createPostMetaOptionsDto);
  }
}
