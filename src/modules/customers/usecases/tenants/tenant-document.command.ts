import { TenantDocumentEntity } from '@customer/persistence/tenants/tenant-document.entity';
import { FileDto } from '@lib/common/file-dto';
import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddTenantDocumentCommand {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty()
  @IsNotEmpty()
  documentTypeId: string;
  @ApiProperty()
  expirationDate: Date;
  file: FileDto;
  currentUser?: UserInfo;
  static toEntity(command: AddTenantDocumentCommand): TenantDocumentEntity {
    const entity = new TenantDocumentEntity();
    entity.tenantId = command.tenantId;
    entity.documentTypeId = command.documentTypeId;
    entity.expirationDate = command.expirationDate;
    entity.file = command.file;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateTenantDocumentCommand extends PartialType(
  AddTenantDocumentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveTenantDocumentCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
  currentUser: UserInfo;
}
