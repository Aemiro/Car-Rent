import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  IncludeQuery,
  CollectionQuery,
} from '@lib/collection-query/collection-query';
import { ApiPaginatedResponse } from '@lib/response-format/api-paginated-response';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserInfo } from '@lib/common/user-info';
import {
  CreateNotificationCommand,
  ArchiveNotificationCommand,
} from '@notification/usecases/notifications/notification.commands';
import { NotificationResponse } from '@notification/usecases/notifications/notification.response';
import { NotificationCommand } from '@notification/usecases/notifications/notification.usecase.command';
import { NotificationQuery } from '@notification/usecases/notifications/notification.usecase.query';

@Controller('notifications')
@ApiTags('notifications')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class NotificationController {
  constructor(
    private command: NotificationCommand,
    private notificationQuery: NotificationQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: NotificationResponse })
  async getNotification(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.notificationQuery.getNotification(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(NotificationResponse)
  async getNotifications(@Query() query: CollectionQuery) {
    return this.notificationQuery.getNotifications(query);
  }
  @Post()
  @ApiOkResponse({ type: NotificationResponse })
  async createNotification(
    @CurrentUser() currentUser: UserInfo,
    @Body() createNotificationCommand: CreateNotificationCommand,
  ) {
    createNotificationCommand.currentUser = currentUser;
    return this.command.createNotification(createNotificationCommand);
  }
  @Put('mark-as-viewed/:id')
  @ApiOkResponse({ type: NotificationResponse })
  async markAsViewed(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.markAsViewed(id, currentUser);
  }
  @Delete('archive')
  @ApiOkResponse({ type: NotificationResponse })
  async archiveNotification(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveNotificationCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveNotification(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteNotification(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteNotification(id, null);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: NotificationResponse })
  async restoreNotification(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreNotification(id, null);
  }
}
