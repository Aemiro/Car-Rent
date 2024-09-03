import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { RevenueResponse } from './revenue.response';
import { RevenueEntity } from '@finance/persistence/revenues/revenue.entity';
@Injectable()
export class RevenueQuery {
  constructor(
    @InjectRepository(RevenueEntity)
    private revenueRepository: Repository<RevenueEntity>,
  ) {}
  async getRevenue(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<RevenueResponse> {
    const product = await this.revenueRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`Revenue not found with id ${id}`);
    }
    return RevenueResponse.toResponse(product);
  }
  async getRevenues(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RevenueResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<RevenueEntity>(
      this.revenueRepository,
      query,
    );
    const d = new DataResponseFormat<RevenueResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RevenueResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveRevenues(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RevenueResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<RevenueEntity>(
      this.revenueRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<RevenueResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RevenueResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
