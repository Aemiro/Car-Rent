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
import { UserInfo } from '@lib/common/user-info';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import {
  CreateMaintenanceAlertCommand,
  UpdateMaintenanceAlertCommand,
  ArchiveMaintenanceAlertCommand,
} from '@asset/usecases/maintenance-alerts/maintenance-alert.commands';
import { MaintenanceAlertResponse } from '@asset/usecases/maintenance-alerts/maintenance-alert.response';
import { MaintenanceAlertCommand } from '@asset/usecases/maintenance-alerts/maintenance-alert.usecase.command';
import { MaintenanceAlertQuery } from '@asset/usecases/maintenance-alerts/maintenance-alert.usecase.query';
@Controller('maintenance-alerts')
@ApiTags('maintenance-alerts')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class MaintenanceAlertController {
  constructor(
    private command: MaintenanceAlertCommand,
    private maintenanceAlertQuery: MaintenanceAlertQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: MaintenanceAlertResponse })
  async getMaintenanceAlert(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.maintenanceAlertQuery.getMaintenanceAlert(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(MaintenanceAlertResponse)
  async getMaintenanceAlerts(@Query() query: CollectionQuery) {
    return this.maintenanceAlertQuery.getMaintenanceAlerts(query);
  }
  @Post()
  @ApiOkResponse({ type: MaintenanceAlertResponse })
  async createMaintenanceAlert(
    @CurrentUser() currentUser: UserInfo,
    @Body() createMaintenanceAlertCommand: CreateMaintenanceAlertCommand,
  ) {
    createMaintenanceAlertCommand.currentUser = currentUser;
    return this.command.createMaintenanceAlert(createMaintenanceAlertCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: MaintenanceAlertResponse })
  async updateMaintenanceAlert(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateMaintenanceAlertCommand: UpdateMaintenanceAlertCommand,
  ) {
    updateMaintenanceAlertCommand.currentUser = currentUser;
    updateMaintenanceAlertCommand.id = id;
    return this.command.updateMaintenanceAlert(updateMaintenanceAlertCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: MaintenanceAlertResponse })
  async archiveMaintenanceAlert(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveMaintenanceAlertCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveMaintenanceAlert(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteMaintenanceAlert(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteMaintenanceAlert(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: MaintenanceAlertResponse })
  async restoreMaintenanceAlert(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreMaintenanceAlert(id, currentUser);
  }
}
