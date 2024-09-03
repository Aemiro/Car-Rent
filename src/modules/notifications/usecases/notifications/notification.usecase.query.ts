import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationResponse } from './notification.response';
import { NotificationEntity } from '../../persistence/notifications/notification.entity';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
@Injectable()
export class NotificationQuery {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}
  async getNotification(
    id: string,
    relations = [],
    withDeleted = false,
  ): Promise<NotificationResponse> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations,
      withDeleted,
    });
    if (!notification) {
      throw new NotFoundException(`Notification not found with id ${id}`);
    }
    return NotificationResponse.toResponse(notification);
  }
  async getNotifications(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<NotificationResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    const dataQuery = QueryConstructor.constructQuery<NotificationEntity>(
      this.notificationRepository,
      query,
    );
    const d = new DataResponseFormat<NotificationResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => NotificationResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
}
