import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from './expense.entity';

@Injectable()
export class ExpenseRepository extends BaseRepository<ExpenseEntity> {
  constructor(
    @InjectRepository(ExpenseEntity)
    repository: Repository<ExpenseEntity>,
  ) {
    super(repository);
  }
}
