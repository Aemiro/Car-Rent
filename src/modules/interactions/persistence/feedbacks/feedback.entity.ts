import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity } from 'typeorm';
@Entity('feedbacks')
export class FeedbackEntity extends CommonEntity {
  @Column()
  subject: string;
  @Column()
  name: string;
  @Column({ nullable:true })
  email: string;
  @Column({ nullable:true })
  phone: string;
  @Column({ type: 'text' })
  message: string;
}