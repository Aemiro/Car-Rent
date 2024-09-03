import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractResponse } from './contract.response';
import { ContractEntity } from '../../persistence/contracts/contract.entity';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
@Injectable()
export class ContractQuery {
  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
  ) {}
  async getContract(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<ContractResponse> {
    const product = await this.contractRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`Contract not found with id ${id}`);
    }
    return ContractResponse.toResponse(product);
  }
  async getContracts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ContractResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<ContractEntity>(
      this.contractRepository,
      query,
    );
    const d = new DataResponseFormat<ContractResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ContractResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveContracts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<ContractResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<ContractEntity>(
      this.contractRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<ContractResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => ContractResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
