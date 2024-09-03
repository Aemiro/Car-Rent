import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentResponse } from './payment.response';
import { PaymentEntity } from '../../persistence/payments/payment.entity';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
@Injectable()
export class PaymentQuery {
  constructor(
    @InjectRepository(PaymentEntity)
    private sectorRepository: Repository<PaymentEntity>,
  ) {}
  async getPayment(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<PaymentResponse> {
    const sector = await this.sectorRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!sector) {
      throw new NotFoundException(`Payment not found with id ${id}`);
    }
    return PaymentResponse.toResponse(sector);
  }
  async getPayments(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PaymentResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<PaymentEntity>(
      this.sectorRepository,
      query,
    );
    const d = new DataResponseFormat<PaymentResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => PaymentResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchivedPayments(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PaymentResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<PaymentEntity>(
      this.sectorRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<PaymentResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => PaymentResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
