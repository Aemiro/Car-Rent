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
  CreateVehicleCommand,
  UpdateVehicleCommand,
  ArchiveVehicleCommand,
} from '@asset/usecases/vehicles/vehicle.commands';
import { VehicleResponse } from '@asset/usecases/vehicles/vehicle.response';
import { VehicleCommand } from '@asset/usecases/vehicles/vehicle.usecase.command';
import { VehicleQuery } from '@asset/usecases/vehicles/vehicle.usecase.query';
import {
  AddVehicleDocumentCommand,
  RemoveVehicleDocumentCommand,
  UpdateVehicleDocumentCommand,
} from '@asset/usecases/vehicles/vehicle-document.command';
@Controller('vehicles')
@ApiTags('vehicles')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class VehicleController {
  constructor(
    private command: VehicleCommand,
    private vehicleQuery: VehicleQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: VehicleResponse })
  async getVehicle(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.vehicleQuery.getVehicle(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(VehicleResponse)
  async getVehicles(@Query() query: CollectionQuery) {
    return this.vehicleQuery.getVehicles(query);
  }
  @Post()
  @ApiOkResponse({ type: VehicleResponse })
  async createVehicle(
    @CurrentUser() currentUser: UserInfo,
    @Body() createVehicleCommand: CreateVehicleCommand,
  ) {
    createVehicleCommand.currentUser = currentUser;
    return this.command.createVehicle(createVehicleCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: VehicleResponse })
  async updateVehicle(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateVehicleCommand: UpdateVehicleCommand,
  ) {
    updateVehicleCommand.currentUser = currentUser;
    updateVehicleCommand.id = id;
    return this.command.updateVehicle(updateVehicleCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: VehicleResponse })
  async archiveVehicle(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveVehicleCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveVehicle(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteVehicle(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteVehicle(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: VehicleResponse })
  async restoreVehicle(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreVehicle(id, currentUser);
  }
  // documents
  @Post('add-document')
  @ApiOkResponse({ type: VehicleResponse })
  async createDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddVehicleDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addDocument(command);
  }
  @Put('update-document')
  @ApiOkResponse({ type: VehicleResponse })
  async updateDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdateVehicleDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateDocument(command);
  }
  @Post('remove-document')
  @ApiOkResponse({ type: VehicleResponse })
  async archiveDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemoveVehicleDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeDocument(command);
  }
}
