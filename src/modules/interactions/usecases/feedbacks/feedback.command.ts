import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { FeedbackEntity } from '../../persistence/feedbacks/feedback.entity';
import { UserInfo } from '@lib/common/user-info';
export class CreateFeedbackCommand {
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  email: string 
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  phone: string;
  currentUser?: UserInfo;

  static toEntity(command: CreateFeedbackCommand): FeedbackEntity {
    const entity = new FeedbackEntity();
    entity.subject = command.subject;
    entity.name = command.name;
    entity.email = command.email;
    entity.message = command.message;
    entity.phone = command.phone;
    entity.createdBy = command?.currentUser?.id;
    entity.updatedBy = command?.currentUser?.id;
    return entity;
  }
}
export class ArchiveFeedbackCommand {
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
