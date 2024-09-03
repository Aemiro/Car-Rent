import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevenueSourceEntity } from './revenue-source.entity';

@Injectable()
export class RevenueSourceRepository extends BaseRepository<RevenueSourceEntity> {
  constructor(
    @InjectRepository(RevenueSourceEntity)
    repository: Repository<RevenueSourceEntity>,
  ) {
    super(repository);
  }
}
