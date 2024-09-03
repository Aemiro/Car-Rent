import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { ExpenseTypeResponse } from './expense-type.response';
import { ExpenseTypeEntity } from '@finance/persistence/expense-types/expense-type.entity';
@Injectable()
export class ExpenseTypeQuery {
  constructor(
    @InjectRepository(ExpenseTypeEntity)
    private contractRepository: Repository<ExpenseTypeEntity>,
  ) {}
  async getExpenseType(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<ExpenseTypeResponse> {
    const product = await this.contractRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`ExpenseType not found with id ${id}`);
    }
    return ExpenseTypeResponse.toResponse(product);
  }
  async getExpenseTypes(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ExpenseTypeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<ExpenseTypeEntity>(
      this.contractRepository,
      query,
    );
    const d = new DataResponseFormat<ExpenseTypeResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ExpenseTypeResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveExpenseTypes(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ExpenseTypeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ExpenseTypeEntity>(
      this.contractRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<ExpenseTypeResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ExpenseTypeResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
