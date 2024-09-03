import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceAlertEntity } from './maintenance-alert.entity';

@Injectable()
export class MaintenanceAlertRepository extends BaseRepository<MaintenanceAlertEntity> {
  constructor(
    @InjectRepository(MaintenanceAlertEntity)
    repository: Repository<MaintenanceAlertEntity>,
  ) {
    super(repository);
  }
}
