import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId')
  public getPosts(@Param('userId') userId: string) {
    return this.postsService.findAll(userId);
  }

  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [CreatePostDto],
  })
  @Post()
  public createPost(@Body() creatPostDto: CreatePostDto) {
    return this.postsService.createPost(creatPostDto);
  }
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    console.log(patchPostDto);
    return 'update post';
  }

  @Delete()
  public delete(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
