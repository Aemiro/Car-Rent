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
  CreateRoleCommand,
  UpdateRoleCommand,
  ArchiveRoleCommand,
} from '../usecases/roles/role.commands';
import { RoleResponse } from '../usecases/roles/role.response';
import { RoleCommand } from '../usecases/roles/role.usecase.command';
import { RoleQuery } from '../usecases/roles/role.usecase.query';
import {
  IncludeQuery,
  CollectionQuery,
} from '@lib/collection-query/collection-query';
import { ApiPaginatedResponse } from '@lib/response-format/api-paginated-response';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserInfo } from '@lib/common/user-info';

@Controller('roles')
@ApiTags('roles')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class RoleController {
  constructor(
    private command: RoleCommand,
    private roleQuery: RoleQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: RoleResponse })
  async getRole(@Param('id') id: string, @Query() includeQuery: IncludeQuery) {
    return this.roleQuery.getRole(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(RoleResponse)
  async getRoles(@Query() query: CollectionQuery) {
    return this.roleQuery.getRoles(query);
  }
  @Post()
  @ApiOkResponse({ type: RoleResponse })
  async createRole(
    @CurrentUser() currentUser: UserInfo,
    @Body() createRoleCommand: CreateRoleCommand,
  ) {
    createRoleCommand.currentUser = currentUser;
    return this.command.createRole(createRoleCommand);
  }
  @Put()
  @ApiOkResponse({ type: RoleResponse })
  async updateRole(
    @CurrentUser() currentUser: UserInfo,
    @Body() updateRoleCommand: UpdateRoleCommand,
  ) {
    updateRoleCommand.currentUser = currentUser;
    return this.command.updateRole(updateRoleCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: RoleResponse })
  async archiveRole(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveRoleCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveRole(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteRole(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteRole(id, null);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: RoleResponse })
  async restoreRole(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreRole(id, null);
  }
}
