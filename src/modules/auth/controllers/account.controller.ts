import { CollectionQuery } from '@lib/collection-query/collection-query';
import { ApiPaginatedResponse } from '@lib/response-format/api-paginated-response';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AccountResponse } from '../usecases/accounts/account.response';
import { UserRoleResponse } from '../usecases/accounts/user-role.response';
import { RoleGuard } from '../guards/role.guard';
import { UserInfo } from '@lib/common/user-info';
import {
  CreateAccountRolesCommand,
  DeleteAccountRoleCommand,
  ArchiveAccountRoleCommand,
} from '../usecases/accounts/account-role.commands';
import { AccountCommand } from '../usecases/accounts/account.usecase.commands';
import { AccountQuery } from '../usecases/accounts/account.usecase.queries';
import { RoleResponse } from '@auth/usecases/roles/role.response';

@Controller('accounts')
@ApiTags('accounts')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class AccountController {
  constructor(
    private command: AccountCommand,
    private accountQuery: AccountQuery,
  ) {}
  @Get('get-account/:id')
  @ApiOkResponse({ type: AccountResponse })
  async getAccount(@Param('id') id: string) {
    return this.accountQuery.getAccount(id);
  }
  @Get('get-accounts')
  @ApiPaginatedResponse(AccountResponse)
  async getAccounts(@Query() query: CollectionQuery) {
    return this.accountQuery.getAccounts(query);
  }
  @Get('get-archived-accounts')
  @ApiPaginatedResponse(AccountResponse)
  async getArchivedAccounts(@Query() query: CollectionQuery) {
    return this.accountQuery.getArchivedAccounts(query);
  }
  @Post('add-account-role')
  @UseGuards(RoleGuard('admin'))
  @ApiOkResponse({ type: RoleResponse, isArray: true })
  async addDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() command: CreateAccountRolesCommand,
  ) {
    command.currentUser = user;
    return this.command.addAccountRole(command);
  }
  @Delete('remove-account-role')
  @UseGuards(RoleGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async removeDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() removeAccountRoleCommand: DeleteAccountRoleCommand,
  ) {
    removeAccountRoleCommand.currentUser = user;
    return this.command.deleteAccountRole(removeAccountRoleCommand);
  }
  @Delete('archive-account-role')
  @UseGuards(RoleGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async archiveDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() archiveAccountRoleCommand: ArchiveAccountRoleCommand,
  ) {
    archiveAccountRoleCommand.currentUser = user;
    return this.command.archiveAccountRole(archiveAccountRoleCommand);
  }
  @Get('get-account-role/:id')
  @ApiOkResponse({ type: UserRoleResponse })
  async getAccountRole(@Param('id') id: string) {
    return this.accountQuery.getAccountRole(id);
  }
  @Get('get-account-roles')
  @ApiPaginatedResponse(UserRoleResponse)
  async getAccountRoles(@Query() query: CollectionQuery) {
    return this.accountQuery.getAccountRoles(query);
  }
  @Get('get-user-roles/:accountId')
  @ApiPaginatedResponse(RoleResponse)
  async getUserRoles(
    @Param('accountId') accountId: string,
    @Query() query: CollectionQuery,
  ) {
    return this.accountQuery.getRolesByAccountId(accountId, query);
  }
  @Get('get-archived-account-roles')
  @ApiPaginatedResponse(UserRoleResponse)
  async getArchivedAccountRoles(@Query() query: CollectionQuery) {
    return this.accountQuery.getArchivedAccountRoles(query);
  }
  @Post('restore-account-role')
  @UseGuards(RoleGuard('admin'))
  @ApiOkResponse({ type: UserRoleResponse })
  async restoreDriverAccountRole(
    @CurrentUser() user: UserInfo,
    @Body() command: DeleteAccountRoleCommand,
  ) {
    command.currentUser = user;
    return this.command.restoreAccountRole(command);
  }
}
