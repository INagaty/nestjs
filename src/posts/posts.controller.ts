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
import { GetPostsDto } from './dtos/get-posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/:userId')
  public getPosts(
    @Param('userId') userId: number,
    @Query() postQuery: GetPostsDto,
  ) {
    return this.postsService.findAll(postQuery, userId);
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
    return this.postsService.update(patchPostDto);
  }

  @Delete()
  public delete(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
