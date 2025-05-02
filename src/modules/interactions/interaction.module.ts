import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './persistence/notifications/notification.entity';
import { NotificationRepository } from './persistence/notifications/notification.repository';
import { NotificationCommand } from './usecases/notifications/notification.usecase.command';
import { NotificationQuery } from './usecases/notifications/notification.usecase.query';
import { NotificationController } from './controllers/notification.controller';
import { FeedbackEntity } from './persistence/feedbacks/feedback.entity';
import { FeedbackRepository } from './persistence/feedbacks/feedback.repository';
import { FeedbackCommand } from './usecases/feedbacks/feedback.usecase.command';
import { FeedbackQuery } from './usecases/feedbacks/feedback.usecase.query';

@Module({
  controllers: [NotificationController],
  imports: [TypeOrmModule.forFeature([NotificationEntity, FeedbackEntity])],
  providers: [NotificationRepository, NotificationCommand, NotificationQuery, FeedbackRepository, FeedbackCommand, FeedbackQuery],
})
export class InteractionModule {}
