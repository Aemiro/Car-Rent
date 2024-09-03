import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { PreventiveMaintenancePlanEntity } from '@asset/persistence/preventive-maintenance-plans/preventive-maintenance-plan.entity';
import { PreventiveMaintenancePlanResponse } from './preventive-maintenance-plan.response';
@Injectable()
export class PreventiveMaintenancePlanQuery {
  constructor(
    @InjectRepository(PreventiveMaintenancePlanEntity)
    private preventiveMaintenancePlanRepository: Repository<PreventiveMaintenancePlanEntity>,
  ) {}
  async getPreventiveMaintenancePlan(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<PreventiveMaintenancePlanResponse> {
    const preventiveMaintenancePlan =
      await this.preventiveMaintenancePlanRepository.findOne({
        where: { id },
        relations,
        withDeleted,
      });
    if (!preventiveMaintenancePlan) {
      throw new NotFoundException(
        `PreventiveMaintenancePlan not found with id ${id}`,
      );
    }
    return PreventiveMaintenancePlanResponse.toResponse(
      preventiveMaintenancePlan,
    );
  }
  async getPreventiveMaintenancePlans(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PreventiveMaintenancePlanResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery =
      QueryConstructor.constructQuery<PreventiveMaintenancePlanEntity>(
        this.preventiveMaintenancePlanRepository,
        query,
      );
    const d = new DataResponseFormat<PreventiveMaintenancePlanResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        PreventiveMaintenancePlanResponse.toResponse(entity),
      );
      d.total = total;
    }
    return d;
  }
  async getArchivedPreventiveMaintenancePlans(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<PreventiveMaintenancePlanResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery =
      QueryConstructor.constructQuery<PreventiveMaintenancePlanEntity>(
        this.preventiveMaintenancePlanRepository,
        query,
      );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<PreventiveMaintenancePlanResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        PreventiveMaintenancePlanResponse.toResponse(entity),
      );
      d.total = total;
    }
    return d;
  }
}
