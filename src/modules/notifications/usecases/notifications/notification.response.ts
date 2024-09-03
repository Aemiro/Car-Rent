import { ApiProperty } from '@nestjs/swagger';
import { NotificationEntity } from '../../persistence/notifications/notification.entity';
export class NotificationResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  receiverId: string;
  @ApiProperty()
  receiverName: string;
  @ApiProperty()
  receiverType: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  notificationType: string;
  @ApiProperty()
  isViewed: boolean;
  @ApiProperty()
  createdBy?: string;
  @ApiProperty()
  updatedBy?: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  deletedAt: Date;
  @ApiProperty()
  deletedBy: string;
  static toResponse(entity: NotificationEntity): NotificationResponse {
    const response = new NotificationResponse();
    response.id = entity.id;
    response.receiverId = entity.receiverId;
    response.receiverName = entity.receiverName;
    response.receiverType = entity.receiverType;
    response.message = entity.message;
    response.notificationType = entity.notificationType;
    response.isViewed = entity.isViewed;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
