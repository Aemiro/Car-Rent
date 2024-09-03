import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { RevenueSourceEntity } from '@finance/persistence/revenue-sources/revenue-source.entity';
export class CreateRevenueSourceCommand {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  code: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isActive?: boolean;

  currentUser: UserInfo;

  static toEntity(command: CreateRevenueSourceCommand): RevenueSourceEntity {
    const entity = new RevenueSourceEntity();
    entity.name = command.name;
    entity.code = command.code;
    entity.description = command.description;
    entity.isActive = command.isActive;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateRevenueSourceCommand extends PartialType(
  CreateRevenueSourceCommand,
) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveRevenueSourceCommand {
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
