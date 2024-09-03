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
  CreateMaintenanceCommand,
  UpdateMaintenanceCommand,
  ArchiveMaintenanceCommand,
} from '@asset/usecases/maintenances/maintenance.commands';
import { MaintenanceResponse } from '@asset/usecases/maintenances/maintenance.response';
import { MaintenanceCommand } from '@asset/usecases/maintenances/maintenance.usecase.command';
import { MaintenanceQuery } from '@asset/usecases/maintenances/maintenance.usecase.query';
import {
  AddMaintenanceDocumentCommand,
  RemoveMaintenanceDocumentCommand,
  UpdateMaintenanceDocumentCommand,
} from '@asset/usecases/maintenances/maintenance-document.command';
@Controller('maintenances')
@ApiTags('maintenances')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class MaintenanceController {
  constructor(
    private command: MaintenanceCommand,
    private maintenanceQuery: MaintenanceQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: MaintenanceResponse })
  async getMaintenance(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.maintenanceQuery.getMaintenance(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(MaintenanceResponse)
  async getMaintenances(@Query() query: CollectionQuery) {
    return this.maintenanceQuery.getMaintenances(query);
  }
  @Post()
  @ApiOkResponse({ type: MaintenanceResponse })
  async createMaintenance(
    @CurrentUser() currentUser: UserInfo,
    @Body() createMaintenanceCommand: CreateMaintenanceCommand,
  ) {
    createMaintenanceCommand.currentUser = currentUser;
    return this.command.createMaintenance(createMaintenanceCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: MaintenanceResponse })
  async updateMaintenance(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateMaintenanceCommand: UpdateMaintenanceCommand,
  ) {
    updateMaintenanceCommand.currentUser = currentUser;
    updateMaintenanceCommand.id = id;
    return this.command.updateMaintenance(updateMaintenanceCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: MaintenanceResponse })
  async archiveMaintenance(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveMaintenanceCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveMaintenance(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteMaintenance(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteMaintenance(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: MaintenanceResponse })
  async restoreMaintenance(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreMaintenance(id, currentUser);
  }
  // documents
  @Post('add-document')
  @ApiOkResponse({ type: MaintenanceResponse })
  async addMaintenanceDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddMaintenanceDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addDocument(command);
  }
  @Put('update-document')
  @ApiOkResponse({ type: MaintenanceResponse })
  async updateMaintenanceDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdateMaintenanceDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateDocument(command);
  }
  @Post('remove-document')
  @ApiOkResponse({ type: MaintenanceResponse })
  async archiveMaintenanceDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemoveMaintenanceDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeDocument(command);
  }
}
