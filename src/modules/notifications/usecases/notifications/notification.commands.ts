import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { NotificationEntity } from '../../persistence/notifications/notification.entity';
import { UserInfo } from '@lib/common/user-info';
export class CreateNotificationCommand {
  @ApiProperty()
  @IsNotEmpty()
  receiverId: string;
  @ApiProperty()
  @IsNotEmpty()
  receiverName: string;
  @ApiProperty()
  receiverType: string = 'Tenant';
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  notificationType: string;
  currentUser: UserInfo;

  static toEntity(command: CreateNotificationCommand): NotificationEntity {
    const entity = new NotificationEntity();
    entity.receiverId = command.receiverId;
    entity.receiverName = command.receiverName;
    entity.receiverType = command.receiverType;

    entity.message = command.message;
    entity.notificationType = command.notificationType;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class ArchiveNotificationCommand {
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
