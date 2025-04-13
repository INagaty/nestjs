import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const page = paginationQuery.page ?? 1;
    const limit = paginationQuery.limit ?? 10;
    const skip = (page - 1) * limit;
    const results = await repository.find({
      take: limit,
      skip: skip,
    });

    //Create Response URLS
    const baseUrl =
      this.request.protocol + '://' + this.request.headers.host + '/';
    const newUrl = new URL(this.request.url, baseUrl);

    //Calculate page numbers
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = paginationQuery.page === totalPages ? page : page + 1;
    const prevPage = paginationQuery.page === 1 ? page : page - 1;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?page=1&limit=${limit}`,
        last: `${newUrl.origin}${newUrl.pathname}?page=${totalPages}&limit=${limit}`,
        current: `${newUrl.origin}${newUrl.pathname}?page=${page}&limit=${limit}`,
        next: `${newUrl.origin}${newUrl.pathname}?page=${nextPage}&limit=${limit}`,
        previous: `${newUrl.origin}${newUrl.pathname}?page=${prevPage}&limit=${limit}`,
      },
    };
    return finalResponse;
  }
}
