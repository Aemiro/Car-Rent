import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevenueEntity } from './revenue.entity';

@Injectable()
export class RevenueRepository extends BaseRepository<RevenueEntity> {
  constructor(
    @InjectRepository(RevenueEntity)
    repository: Repository<RevenueEntity>,
  ) {
    super(repository);
  }
}
