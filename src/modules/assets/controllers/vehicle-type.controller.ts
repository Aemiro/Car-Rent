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
  CreateVehicleTypeCommand,
  UpdateVehicleTypeCommand,
  ArchiveVehicleTypeCommand,
} from '@asset/usecases/vehicle-types/vehicle-type.commands';
import { VehicleTypeResponse } from '@asset/usecases/vehicle-types/vehicle-type.response';
import { VehicleTypeCommand } from '@asset/usecases/vehicle-types/vehicle-type.usecase.command';
import { VehicleTypeQuery } from '@asset/usecases/vehicle-types/vehicle-type.usecase.query';
@Controller('vehicle-types')
@ApiTags('vehicle-types')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class VehicleTypeController {
  constructor(
    private command: VehicleTypeCommand,
    private vehicleTypeQuery: VehicleTypeQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: VehicleTypeResponse })
  async getVehicleType(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.vehicleTypeQuery.getVehicleType(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(VehicleTypeResponse)
  async getVehicleTypes(@Query() query: CollectionQuery) {
    return this.vehicleTypeQuery.getVehicleTypes(query);
  }
  @Post()
  @ApiOkResponse({ type: VehicleTypeResponse })
  async createVehicleType(
    @CurrentUser() currentUser: UserInfo,
    @Body() createVehicleTypeCommand: CreateVehicleTypeCommand,
  ) {
    createVehicleTypeCommand.currentUser = currentUser;
    return this.command.createVehicleType(createVehicleTypeCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: VehicleTypeResponse })
  async updateVehicleType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateVehicleTypeCommand: UpdateVehicleTypeCommand,
  ) {
    updateVehicleTypeCommand.currentUser = currentUser;
    updateVehicleTypeCommand.id = id;
    return this.command.updateVehicleType(updateVehicleTypeCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: VehicleTypeResponse })
  async archiveVehicleType(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveVehicleTypeCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveVehicleType(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteVehicleType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteVehicleType(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: VehicleTypeResponse })
  async restoreVehicleType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreVehicleType(id, currentUser);
  }
}
