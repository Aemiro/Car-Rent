import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleResponse } from './role.response';
import { RoleEntity } from '../../persistence/roles/role.entity';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
@Injectable()
export class RoleQuery {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}
  async getRole(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<RoleResponse> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!role) {
      throw new NotFoundException(`Role not found with id ${id}`);
    }
    return RoleResponse.toResponse(role);
  }
  async getRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    );
    const d = new DataResponseFormat<RoleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchivedRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<RoleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
