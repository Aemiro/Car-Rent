import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { RevenueSourceResponse } from './revenue-source.response';
import { RevenueSourceEntity } from '@finance/persistence/revenue-sources/revenue-source.entity';
@Injectable()
export class RevenueSourceQuery {
  constructor(
    @InjectRepository(RevenueSourceEntity)
    private contractRepository: Repository<RevenueSourceEntity>,
  ) {}
  async getRevenueSource(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<RevenueSourceResponse> {
    const product = await this.contractRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`RevenueSource not found with id ${id}`);
    }
    return RevenueSourceResponse.toResponse(product);
  }
  async getRevenueSources(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RevenueSourceResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<RevenueSourceEntity>(
      this.contractRepository,
      query,
    );
    const d = new DataResponseFormat<RevenueSourceResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RevenueSourceResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveRevenueSources(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RevenueSourceResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<RevenueSourceEntity>(
      this.contractRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<RevenueSourceResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RevenueSourceResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
