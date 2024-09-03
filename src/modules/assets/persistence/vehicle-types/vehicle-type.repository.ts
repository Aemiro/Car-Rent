import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { VehicleTypeEntity } from './vehicle.type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class VehicleTypeRepository extends BaseRepository<VehicleTypeEntity> {
  constructor(
    @InjectRepository(VehicleTypeEntity)
    repository: Repository<VehicleTypeEntity>,
  ) {
    super(repository);
  }
}
