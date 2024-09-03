import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentTypeResponse } from './document-type.response';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
@Injectable()
export class DocumentTypeQuery {
  constructor(
    @InjectRepository(DocumentTypeEntity)
    private contractRepository: Repository<DocumentTypeEntity>,
  ) {}
  async getDocumentType(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<DocumentTypeResponse> {
    const product = await this.contractRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!product) {
      throw new NotFoundException(`DocumentType not found with id ${id}`);
    }
    return DocumentTypeResponse.toResponse(product);
  }
  async getDocumentTypes(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<DocumentTypeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<DocumentTypeEntity>(
      this.contractRepository,
      query,
    );
    const d = new DataResponseFormat<DocumentTypeResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => DocumentTypeResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchiveDocumentTypes(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<DocumentTypeResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<DocumentTypeEntity>(
      this.contractRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<DocumentTypeResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => DocumentTypeResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
