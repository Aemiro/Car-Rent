import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { VehicleTypeEntity } from '@asset/persistence/vehicle-types/vehicle.type.entity';
import { VehicleTypeResponse } from './vehicle-type.response';
@Injectable()
export class VehicleTypeQuery {
  constructor(
    @InjectRepository(VehicleTypeEntity)
    private contractRepository: Repository<VehicleTypeEntity>,
  ) {}
  async getVehicleType(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<VehicleTypeResponse> {
    const product = await this.contractRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`VehicleType not found with id ${id}`);
    }
    return VehicleTypeResponse.toResponse(product);
  }
  async getVehicleTypes(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<VehicleTypeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<VehicleTypeEntity>(
      this.contractRepository,
      query,
    );
    const d = new DataResponseFormat<VehicleTypeResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => VehicleTypeResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveVehicleTypes(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<VehicleTypeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<VehicleTypeEntity>(
      this.contractRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<VehicleTypeResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => VehicleTypeResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
