/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsSerivce: TagsService,
  ) {}

  public async createPost(@Body() createPostDto: CreatePostDto) {
    const author = await this.usersService.findOneById(createPostDto.authorId);

    if (!author) {
      throw new Error('Author not found');
    }

    // Ensure tags are resolved to Tag[] before assigning
    const tags = createPostDto.tags
      ? await this.tagsSerivce.findMultipleTags(createPostDto.tags)
      : [];

    const post = this.postRepository.create({
      ...createPostDto,
      author: { id: author.id } as any, // Explicitly cast to match DeepPartial<User>
      metaOptions: createPostDto.metaOptions || undefined,
      tags: tags as any, // Explicitly cast to match DeepPartial<Tag[]>
    });

    return await this.postRepository.save(post);
  }

  public async findAll(userId: number) {
    const user = this.usersService.findOneById(userId);
    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
        author: true,
      },
    });
    console.log(user);
    return posts;
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags;
    let post;
    patchPostDto.tags = patchPostDto.tags || [];

    try {
      tags = await this.tagsSerivce.findMultipleTags(patchPostDto.tags);
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
      console.log(error);
    }
    if (!tags || tags.length !== patchPostDto.tags.length) {
      throw new BadRequestException('Please check your tag IDs');
    }

    try {
      post = await this.postRepository.findOneBy({ id: patchPostDto.id });
    } catch (error) {
      throw new BadRequestException('Post not found');
      console.log(error);
    }
    if (!post) {
      throw new BadRequestException('Post ID doesnt exist');
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags;

    try {
      await this.postRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException('Error connecting to the database');
      console.log(error);
    }
    return post;
  }
}
