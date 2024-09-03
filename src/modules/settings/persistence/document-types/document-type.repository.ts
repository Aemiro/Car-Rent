import { BaseRepository } from '@lib/common/repositories/base.repository';
import { Injectable } from '@nestjs/common';
import { DocumentTypeEntity } from './document.type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DocumentTypeRepository extends BaseRepository<DocumentTypeEntity> {
  constructor(
    @InjectRepository(DocumentTypeEntity)
    repository: Repository<DocumentTypeEntity>,
  ) {
    super(repository);
  }
}
