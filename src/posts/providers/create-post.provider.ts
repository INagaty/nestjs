/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly usersService: UsersService,

    private readonly tagsSerivce: TagsService,
  ) {}
  public async createPost(createPostDto: CreatePostDto, user: ActiveUserData) {
    let author = undefined;
    let tags: null | any = null;
    try {
      author = await this.usersService.findOneById(user.sub);

      // Ensure tags are resolved to Tag[] before assigning
      tags = createPostDto.tags
        ? await this.tagsSerivce.findMultipleTags(createPostDto.tags)
        : [];
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto?.tags?.length !== tags.length) {
      throw new BadRequestException(
        'Some tags are not valid. Please check your input.',
      );
    }

    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      metaOptions: createPostDto.metaOptions || undefined,
      tags: tags,
    });

    try {
      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure Post Slug is Unique',
      });
    }
  }
}
