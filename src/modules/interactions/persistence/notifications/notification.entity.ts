import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity } from 'typeorm';
@Entity('notifications')
export class NotificationEntity extends CommonEntity {
  @Column({ name: 'receiver_id' })
  receiverId: string;
  @Column({ name: 'receiver_name' })
  receiverName: string;
  @Column({ name: 'receiver_type', default: 'Tenant' })
  receiverType: string;
  @Column({ name: 'message' })
  message: string;
  @Column({ name: 'notification_type' })
  notificationType: string;
  @Column({ name: 'is_viewed', default: false })
  isViewed: boolean;
}
