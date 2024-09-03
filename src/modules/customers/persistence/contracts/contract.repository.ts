import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractEntity } from './contract.entity';

@Injectable()
export class ContractRepository extends BaseRepository<ContractEntity> {
  constructor(
    @InjectRepository(ContractEntity)
    repository: Repository<ContractEntity>,
  ) {
    super(repository);
  }
}
