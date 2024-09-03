import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';

export class CreateDocumentTypeCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  note: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  isContractDocument?: boolean;
  @ApiProperty()
  isFinanceDocument?: boolean;
  @ApiProperty()
  isDriverDocument?: boolean;
  @ApiProperty()
  isVehicleDocument?: boolean;
  @ApiProperty()
  hasExpirationDate?: boolean;

  currentUser: UserInfo;

  static toEntity(command: CreateDocumentTypeCommand): DocumentTypeEntity {
    const entity = new DocumentTypeEntity();
    entity.name = command.name;
    entity.note = command.note;
    entity.code = command.code;
    entity.isContractDocument = command.isContractDocument;
    entity.isFinanceDocument = command.isFinanceDocument;
    entity.isDriverDocument = command.isDriverDocument;
    entity.isVehicleDocument = command.isVehicleDocument;
    entity.hasExpirationDate = command.hasExpirationDate;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateDocumentTypeCommand extends PartialType(
  CreateDocumentTypeCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveDocumentTypeCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  reason: string;
  currentUser: UserInfo;
}
