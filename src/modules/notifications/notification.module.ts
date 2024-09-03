import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './persistence/notifications/notification.entity';
import { NotificationRepository } from './persistence/notifications/notification.repository';
import { NotificationCommand } from './usecases/notifications/notification.usecase.command';
import { NotificationQuery } from './usecases/notifications/notification.usecase.query';
import { NotificationController } from './controllers/notification.controller';

@Module({
  controllers: [NotificationController],
  imports: [TypeOrmModule.forFeature([NotificationEntity])],
  providers: [NotificationRepository, NotificationCommand, NotificationQuery],
})
export class NotificationModule {}
