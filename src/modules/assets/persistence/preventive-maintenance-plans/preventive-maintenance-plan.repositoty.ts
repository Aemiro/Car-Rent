import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreventiveMaintenancePlanEntity } from './preventive-maintenance-plan.entity';

@Injectable()
export class PreventiveMaintenancePlanRepository extends BaseRepository<PreventiveMaintenancePlanEntity> {
  constructor(
    @InjectRepository(PreventiveMaintenancePlanEntity)
    repository: Repository<PreventiveMaintenancePlanEntity>,
  ) {
    super(repository);
  }
}
