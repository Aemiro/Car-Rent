import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './vehicle.entity';

@Injectable()
export class VehicleRepository extends BaseRepository<VehicleEntity> {
  constructor(
    @InjectRepository(VehicleEntity)
    repository: Repository<VehicleEntity>,
  ) {
    super(repository);
  }
}
