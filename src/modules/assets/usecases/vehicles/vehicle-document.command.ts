import { VehicleDocumentEntity } from '@asset/persistence/vehicles/vehicle-document.entity';
import { FileDto } from '@lib/common/file-dto';
import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddVehicleDocumentCommand {
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  @ApiProperty()
  @IsNotEmpty()
  documentTypeId: string;
  @ApiProperty()
  expirationDate: Date;
  file: FileDto;
  currentUser?: UserInfo;
  static toEntity(command: AddVehicleDocumentCommand): VehicleDocumentEntity {
    const entity = new VehicleDocumentEntity();
    entity.vehicleId = command.vehicleId;
    entity.documentTypeId = command.documentTypeId;
    entity.expirationDate = command.expirationDate;
    entity.file = command.file;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateVehicleDocumentCommand extends PartialType(
  AddVehicleDocumentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveVehicleDocumentCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  vehicleId: string;
  currentUser: UserInfo;
}
