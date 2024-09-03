import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { UserInfo } from '@lib/common/user-info';
import { RevenueEntity } from '@finance/persistence/revenues/revenue.entity';
export class CreateRevenueCommand {
  @ApiProperty()
  @IsNotEmpty()
  amount: number;
  @ApiProperty()
  @IsNotEmpty()
  sourceId: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  revenueDate?: Date;

  currentUser: UserInfo;

  static toEntity(command: CreateRevenueCommand): RevenueEntity {
    const entity = new RevenueEntity();
    entity.amount = command.amount;
    entity.sourceId = command.sourceId;
    entity.description = command.description;
    entity.revenueDate = command.revenueDate;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class UpdateRevenueCommand extends PartialType(CreateRevenueCommand) {
  @ApiProperty({
    example: 'd02dd06f-2a30-4ed8-a2a0-75c683e3092e',
  })
  @IsNotEmpty()
  id: string;
}
export class ArchiveRevenueCommand {
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
