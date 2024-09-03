import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseTypeEntity } from './expense-type.entity';

@Injectable()
export class ExpenseTypeRepository extends BaseRepository<ExpenseTypeEntity> {
  constructor(
    @InjectRepository(ExpenseTypeEntity)
    repository: Repository<ExpenseTypeEntity>,
  ) {
    super(repository);
  }
}
