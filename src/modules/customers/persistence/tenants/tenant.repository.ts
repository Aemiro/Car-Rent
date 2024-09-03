import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantEntity } from './tenant.entity';

@Injectable()
export class TenantRepository extends BaseRepository<TenantEntity> {
  constructor(
    @InjectRepository(TenantEntity)
    repository: Repository<TenantEntity>,
  ) {
    super(repository);
  }
}
