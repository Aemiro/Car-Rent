import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedbackEntity } from './feedback.entity';

@Injectable()
export class FeedbackRepository extends BaseRepository<FeedbackEntity> {
  constructor(
    @InjectRepository(FeedbackEntity)
    repository: Repository<FeedbackEntity>,
  ) {
    super(repository);
  }
}
