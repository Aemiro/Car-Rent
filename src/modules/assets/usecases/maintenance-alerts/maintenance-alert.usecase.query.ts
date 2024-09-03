import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { MaintenanceAlertResponse } from './maintenance-alert.response';
import { MaintenanceAlertEntity } from '@asset/persistence/maintenance-alerts/maintenance-alert.entity';
@Injectable()
export class MaintenanceAlertQuery {
  constructor(
    @InjectRepository(MaintenanceAlertEntity)
    private maintenanceAlertRepository: Repository<MaintenanceAlertEntity>,
  ) {}
  async getMaintenanceAlert(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<MaintenanceAlertResponse> {
    const maintenanceAlert = await this.maintenanceAlertRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!maintenanceAlert) {
      throw new NotFoundException(`MaintenanceAlert not found with id ${id}`);
    }
    return MaintenanceAlertResponse.toResponse(maintenanceAlert);
  }
  async getMaintenanceAlerts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<MaintenanceAlertResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<MaintenanceAlertEntity>(
      this.maintenanceAlertRepository,
      query,
    );
    const d = new DataResponseFormat<MaintenanceAlertResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        MaintenanceAlertResponse.toResponse(entity),
      );
      d.total = total;
    }
    return d;
  }
  async getArchivedMaintenanceAlerts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<MaintenanceAlertResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<MaintenanceAlertEntity>(
      this.maintenanceAlertRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<MaintenanceAlertResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) =>
        MaintenanceAlertResponse.toResponse(entity),
      );
      d.total = total;
    }
    return d;
  }
}
