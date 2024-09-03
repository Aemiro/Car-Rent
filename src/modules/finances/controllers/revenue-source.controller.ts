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
  CreateRevenueSourceCommand,
  UpdateRevenueSourceCommand,
  ArchiveRevenueSourceCommand,
} from '@finance/usecases/revenue-sources/revenue-source.commands';
import { RevenueSourceResponse } from '@finance/usecases/revenue-sources/revenue-source.response';
import { RevenueSourceCommand } from '@finance/usecases/revenue-sources/revenue-source.usecase.command';
import { RevenueSourceQuery } from '@finance/usecases/revenue-sources/revenue-source.usecase.query';

@Controller('revenue-sources')
@ApiTags('revenue-sources')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class RevenueSourceController {
  constructor(
    private command: RevenueSourceCommand,
    private revenueSourceQuery: RevenueSourceQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: RevenueSourceResponse })
  async getRevenueSource(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.revenueSourceQuery.getRevenueSource(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(RevenueSourceResponse)
  async getRevenueSources(@Query() query: CollectionQuery) {
    return this.revenueSourceQuery.getRevenueSources(query);
  }
  @Post()
  @ApiOkResponse({ type: RevenueSourceResponse })
  async createRevenueSource(
    @CurrentUser() currentUser: UserInfo,
    @Body() createRevenueSourceCommand: CreateRevenueSourceCommand,
  ) {
    createRevenueSourceCommand.currentUser = currentUser;
    return this.command.createRevenueSource(createRevenueSourceCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: RevenueSourceResponse })
  async updateRevenueSource(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateRevenueSourceCommand: UpdateRevenueSourceCommand,
  ) {
    updateRevenueSourceCommand.currentUser = currentUser;
    updateRevenueSourceCommand.id = id;
    return this.command.updateRevenueSource(updateRevenueSourceCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: RevenueSourceResponse })
  async archiveRevenueSource(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveRevenueSourceCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveRevenueSource(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteRevenueSource(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteRevenueSource(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: RevenueSourceResponse })
  async restoreRevenueSource(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreRevenueSource(id, currentUser);
  }
}
