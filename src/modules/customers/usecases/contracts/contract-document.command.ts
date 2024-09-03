import { ContractDocumentEntity } from '@customer/persistence/contracts/contract-document.entity';
import { FileDto } from '@lib/common/file-dto';
import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class AddContractDocumentCommand {
  @ApiProperty()
  @IsNotEmpty()
  contractId: string;
  @ApiProperty()
  @IsNotEmpty()
  documentTypeId: string;
  @ApiProperty()
  expirationDate: Date;
  file: FileDto;
  currentUser?: UserInfo;
  static toEntity(command: AddContractDocumentCommand): ContractDocumentEntity {
    const entity = new ContractDocumentEntity();
    entity.contractId = command.contractId;
    entity.documentTypeId = command.documentTypeId;
    entity.expirationDate = command.expirationDate;
    entity.file = command.file;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateContractDocumentCommand extends PartialType(
  AddContractDocumentCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveContractDocumentCommand {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  contractId: string;
  currentUser: UserInfo;
}
