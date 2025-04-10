/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Injectable } from '@nestjs/common';
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
    const tags = patchPostDto.tags
      ? await this.tagsSerivce.findMultipleTags(patchPostDto.tags)
      : [];
    const post = await this.postRepository.findOneBy({ id: patchPostDto.id });
    if (!post) {
      throw new Error('Post not found');
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;
    post.tags = tags as any;

    return await this.postRepository.save(post);
  }
}
