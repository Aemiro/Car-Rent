import {
  ArchiveNotificationCommand,
  CreateNotificationCommand,
} from './notification.commands';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationResponse } from './notification.response';
import { NotificationRepository } from '../../persistence/notifications/notification.repository';
import { UserInfo } from '@lib/common/user-info';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class NotificationCommand {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private eventEmitter: EventEmitter2,
  ) {}
  async createNotification(
    command: CreateNotificationCommand,
  ): Promise<NotificationResponse> {
    const notificationDomain = CreateNotificationCommand.toEntity(command);
    notificationDomain.createdBy = command?.currentUser?.id;
    notificationDomain.updatedBy = command?.currentUser?.id;
    const notification =
      await this.notificationRepository.insert(notificationDomain);
    return NotificationResponse.toResponse(notification);
  }
  async markAsViewed(
    id: string,
    currentUser: UserInfo,
  ): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.getById(id);
    if (!notification) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    notification.isViewed = !notification.isViewed;
    notification.updatedBy = currentUser?.id;
    const result = await this.notificationRepository.save(notification);

    return NotificationResponse.toResponse(result);
  }
  async archiveNotification(
    command: ArchiveNotificationCommand,
  ): Promise<NotificationResponse> {
    const notificationDomain = await this.notificationRepository.getById(
      command.id,
    );
    if (!notificationDomain) {
      throw new NotFoundException(
        `Notification not found with id ${command.id}`,
      );
    }
    notificationDomain.deletedAt = new Date();
    notificationDomain.deletedBy = command?.currentUser?.id;
    const result = await this.notificationRepository.save(notificationDomain);
    return NotificationResponse.toResponse(result);
  }
  async restoreNotification(
    id: string,
    currentUser: UserInfo,
  ): Promise<NotificationResponse> {
    const notificationDomain = await this.notificationRepository.getById(
      id,
      [],
      true,
    );
    if (!notificationDomain) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    await this.notificationRepository.restore(id);
    return NotificationResponse.toResponse(notificationDomain);
  }
  async deleteNotification(
    id: string,
    currentUser: UserInfo,
  ): Promise<boolean> {
    const notificationDomain = await this.notificationRepository.getById(
      id,
      [],
      true,
    );
    if (!notificationDomain) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    const result = await this.notificationRepository.delete(id);
    return result;
  }
}
