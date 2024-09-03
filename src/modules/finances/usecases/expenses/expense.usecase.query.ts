import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { ExpenseResponse } from './expense.response';
import { ExpenseEntity } from '@finance/persistence/expenses/expense.entity';
@Injectable()
export class ExpenseQuery {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expenseRepository: Repository<ExpenseEntity>,
  ) {}
  async getExpense(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<ExpenseResponse> {
    const product = await this.expenseRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`Expense not found with id ${id}`);
    }
    return ExpenseResponse.toResponse(product);
  }
  async getExpenses(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ExpenseResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<ExpenseEntity>(
      this.expenseRepository,
      query,
    );
    const d = new DataResponseFormat<ExpenseResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ExpenseResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveExpenses(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ExpenseResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ExpenseEntity>(
      this.expenseRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<ExpenseResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ExpenseResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
