import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantResponse } from './tenant.response';
import { TenantEntity } from '../../persistence/tenants/tenant.entity';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
@Injectable()
export class TenantQuery {
  constructor(
    @InjectRepository(TenantEntity)
    private tenantRepository: Repository<TenantEntity>,
  ) {}
  async getTenant(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant not found with id ${id}`);
    }
    return TenantResponse.toResponse(tenant);
  }
  async getTenants(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<TenantResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<TenantEntity>(
      this.tenantRepository,
      query,
    );
    const d = new DataResponseFormat<TenantResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => TenantResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
