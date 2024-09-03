import { UserInfo } from '@lib/common/user-info';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TenantContactEntity } from '@customer/persistence/tenants/tenant-contact.entity';
import { IsNotEmpty } from 'class-validator';
export class AddTenantContactCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
  @ApiProperty()
  note: string;
  @ApiProperty()
  @IsNotEmpty()
  phone: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  position: string;
  @ApiProperty()
  @IsNotEmpty()
  gender: string;
  currentUser?: UserInfo;
  static toEntity(command: AddTenantContactCommand): TenantContactEntity {
    const entity = new TenantContactEntity();
    entity.name = command.name;
    entity.tenantId = command.tenantId;
    entity.note = command.note;
    entity.phone = command.phone;
    entity.email = command.email;
    entity.position = command.position;
    entity.gender = command.gender;
    entity.updatedBy = command?.currentUser?.id;
    entity.createdBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateTenantContactCommand extends PartialType(
  AddTenantContactCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}

export class RemoveTenantContactCommand {
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
