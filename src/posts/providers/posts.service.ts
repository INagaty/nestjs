import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ManyToOne, Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async createPost(@Body() createPostDto: CreatePostDto) {
    let metaOptions: MetaOption | undefined;
    if (createPostDto.metaOptions) {
      metaOptions = this.metaOptionsRepository.create(
        createPostDto.metaOptions,
      );
      await this.metaOptionsRepository.save(metaOptions);
    }

    // Create Post
    const post = this.postRepository.create({
      ...createPostDto,
      metaOptions, // Assign the transformed metaOptions
    });
    await this.postRepository.save(post);

    return post;
  }
  public async findAll(userId: string) {
    const user = this.usersService.findOneById(userId);
    const posts = await this.postRepository.find({
      relations: {
        metaOptions: true,
      },
    });
    console.log(user);
    return posts;
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return {deleted: true, id}
  }

  @ManyToOne(() =>User, (user) => user.posts)
  author: User;
}
