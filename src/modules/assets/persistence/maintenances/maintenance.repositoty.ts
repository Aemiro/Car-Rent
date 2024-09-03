import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceEntity } from './maintenance.entity';

@Injectable()
export class MaintenanceRepository extends BaseRepository<MaintenanceEntity> {
  constructor(
    @InjectRepository(MaintenanceEntity)
    repository: Repository<MaintenanceEntity>,
  ) {
    super(repository);
  }
}
