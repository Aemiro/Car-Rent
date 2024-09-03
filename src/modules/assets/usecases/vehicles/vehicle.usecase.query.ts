import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleResponse } from './vehicle.response';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
@Injectable()
export class VehicleQuery {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}
  async getVehicle(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<VehicleResponse> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle not found with id ${id}`);
    }
    return VehicleResponse.toResponse(vehicle);
  }
  async getVehicles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<VehicleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<VehicleEntity>(
      this.vehicleRepository,
      query,
    );
    const d = new DataResponseFormat<VehicleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => VehicleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchivedVehicles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<VehicleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<VehicleEntity>(
      this.vehicleRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<VehicleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => VehicleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
