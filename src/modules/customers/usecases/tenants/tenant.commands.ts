import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TenantEntity } from '../../persistence/tenants/tenant.entity';
import { UserInfo } from '@lib/common/user-info';
import { FileDto } from '@lib/common/file-dto';
import { Address } from '@lib/common/address';

export class CreateTenantCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsNotEmpty()
  phone: string;
  @ApiProperty()
  tin: string;
  @ApiProperty()
  website: string;
  @ApiProperty()
  note: string;
  @ApiProperty()
  address: Address;
  logo?: FileDto;
  currentUser: UserInfo;

  static toEntity(command: CreateTenantCommand): TenantEntity {
    const entity = new TenantEntity();
    entity.name = command.name;
    entity.email = command.email;
    entity.phone = command.phone;
    entity.tin = command.tin;
    entity.address = command.address;
    entity.website = command.website;
    entity.note = command.note;
    entity.logo = command.logo;
    entity.isActive = true;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateTenantCommand extends PartialType(CreateTenantCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  isActive: boolean;
}
export class ArchiveTenantCommand {
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
