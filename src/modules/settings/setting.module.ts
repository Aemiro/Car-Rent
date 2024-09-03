import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentTypeEntity } from './persistence/document-types/document.type.entity';
import { DocumentTypeRepository } from './persistence/document-types/document-type.repository';
import { DocumentTypeCommand } from './usecases/document-types/document-type.usecase.command';
import { DocumentTypeQuery } from './usecases/document-types/document-type.usecase.query';
import { DocumentTypeController } from './controllers/document-type.controller';
@Module({
  controllers: [DocumentTypeController],
  imports: [TypeOrmModule.forFeature([DocumentTypeEntity])],
  providers: [DocumentTypeRepository, DocumentTypeCommand, DocumentTypeQuery],
})
export class SettingModule {}
