import { MaintenanceDocumentEntity } from '@asset/persistence/maintenances/maintenance-document.entity';
import { FileDto } from '@lib/common/file-dto';
import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddMaintenanceDocumentCommand {
  @ApiProperty()
  @IsNotEmpty()
  maintenanceId: string;
  @ApiProperty()
  @IsNotEmpty()
  documentTypeId: string;
  file: FileDto;
  currentUser?: UserInfo;
  static toEntity(
    command: AddMaintenanceDocumentCommand,
  ): MaintenanceDocumentEntity {
    const entity = new MaintenanceDocumentEntity();
    entity.maintenanceId = command.maintenanceId;
    entity.documentTypeId = command.documentTypeId;
    entity.file = command.file;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateMaintenanceDocumentCommand extends PartialType(
  AddMaintenanceDocumentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveMaintenanceDocumentCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  maintenanceId: string;
  currentUser: UserInfo;
}
