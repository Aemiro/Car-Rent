import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceResponse } from './maintenance.response';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { MaintenanceEntity } from '@asset/persistence/maintenances/maintenance.entity';
@Injectable()
export class MaintenanceQuery {
  constructor(
    @InjectRepository(MaintenanceEntity)
    private maintenanceRepository: Repository<MaintenanceEntity>,
  ) {}
  async getMaintenance(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<MaintenanceResponse> {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!maintenance) {
      throw new NotFoundException(`Maintenance not found with id ${id}`);
    }
    return MaintenanceResponse.toResponse(maintenance);
  }
  async getMaintenances(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<MaintenanceResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<MaintenanceEntity>(
      this.maintenanceRepository,
      query,
    );
    const d = new DataResponseFormat<MaintenanceResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => MaintenanceResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchivedMaintenances(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<MaintenanceResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<MaintenanceEntity>(
      this.maintenanceRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<MaintenanceResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => MaintenanceResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
