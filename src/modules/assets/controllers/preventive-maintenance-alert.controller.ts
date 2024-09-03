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
  CreatePreventiveMaintenancePlanCommand,
  UpdatePreventiveMaintenancePlanCommand,
  ArchivePreventiveMaintenancePlanCommand,
} from '@asset/usecases/preventive-maintenance-plans/preventive-maintenance-plan.commands';
import { PreventiveMaintenancePlanResponse } from '@asset/usecases/preventive-maintenance-plans/preventive-maintenance-plan.response';
import { PreventiveMaintenancePlanCommand } from '@asset/usecases/preventive-maintenance-plans/preventive-maintenance-plan.usecase.command';
import { PreventiveMaintenancePlanQuery } from '@asset/usecases/preventive-maintenance-plans/preventive-maintenance-plan.usecase.query';
@Controller('preventive-maintenance-plans')
@ApiTags('preventive-maintenance-plans')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class PreventiveMaintenancePlanController {
  constructor(
    private command: PreventiveMaintenancePlanCommand,
    private maintenanceAlertQuery: PreventiveMaintenancePlanQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: PreventiveMaintenancePlanResponse })
  async getPreventiveMaintenancePlan(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.maintenanceAlertQuery.getPreventiveMaintenancePlan(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(PreventiveMaintenancePlanResponse)
  async getPreventiveMaintenancePlans(@Query() query: CollectionQuery) {
    return this.maintenanceAlertQuery.getPreventiveMaintenancePlans(query);
  }
  @Post()
  @ApiOkResponse({ type: PreventiveMaintenancePlanResponse })
  async createPreventiveMaintenancePlan(
    @CurrentUser() currentUser: UserInfo,
    @Body()
    createPreventiveMaintenancePlanCommand: CreatePreventiveMaintenancePlanCommand,
  ) {
    createPreventiveMaintenancePlanCommand.currentUser = currentUser;
    return this.command.createPreventiveMaintenancePlan(
      createPreventiveMaintenancePlanCommand,
    );
  }
  @Put(':id')
  @ApiOkResponse({ type: PreventiveMaintenancePlanResponse })
  async updatePreventiveMaintenancePlan(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body()
    updatePreventiveMaintenancePlanCommand: UpdatePreventiveMaintenancePlanCommand,
  ) {
    updatePreventiveMaintenancePlanCommand.currentUser = currentUser;
    updatePreventiveMaintenancePlanCommand.id = id;
    return this.command.updatePreventiveMaintenancePlan(
      updatePreventiveMaintenancePlanCommand,
    );
  }
  @Delete('archive')
  @ApiOkResponse({ type: PreventiveMaintenancePlanResponse })
  async archivePreventiveMaintenancePlan(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchivePreventiveMaintenancePlanCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archivePreventiveMaintenancePlan(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deletePreventiveMaintenancePlan(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deletePreventiveMaintenancePlan(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: PreventiveMaintenancePlanResponse })
  async restorePreventiveMaintenancePlan(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restorePreventiveMaintenancePlan(id, currentUser);
  }
}
