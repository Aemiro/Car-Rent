import { ApiProperty } from '@nestjs/swagger';
import { FeedbackEntity } from '../../persistence/feedbacks/feedback.entity';
export class FeedbackResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  subject: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  phone: string;
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
  static toResponse(entity: FeedbackEntity): FeedbackResponse {
    const response = new FeedbackResponse();
    response.id = entity.id;
    response.subject = entity.subject;
    response.name = entity.name;
    response.email = entity.email;
    response.message = entity.message;
    response.phone = entity.phone;
    response.createdBy = entity.createdBy;
    response.updatedBy = entity.updatedBy;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;
    response.deletedAt = entity.deletedAt;
    response.deletedBy = entity.deletedBy;
    return response;
  }
}
