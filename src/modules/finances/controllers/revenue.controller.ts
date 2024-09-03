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
  CreateRevenueCommand,
  UpdateRevenueCommand,
  ArchiveRevenueCommand,
} from '@finance/usecases/revenues/revenue.commands';
import { RevenueResponse } from '@finance/usecases/revenues/revenue.response';
import { RevenueCommand } from '@finance/usecases/revenues/revenue.usecase.command';
import { RevenueQuery } from '@finance/usecases/revenues/revenue.usecase.query';

@Controller('revenues')
@ApiTags('revenues')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class RevenueController {
  constructor(
    private command: RevenueCommand,
    private revenueQuery: RevenueQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: RevenueResponse })
  async getRevenue(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.revenueQuery.getRevenue(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(RevenueResponse)
  async getRevenues(@Query() query: CollectionQuery) {
    return this.revenueQuery.getRevenues(query);
  }
  @Post()
  @ApiOkResponse({ type: RevenueResponse })
  async createRevenue(
    @CurrentUser() currentUser: UserInfo,
    @Body() createRevenueCommand: CreateRevenueCommand,
  ) {
    createRevenueCommand.currentUser = currentUser;
    return this.command.createRevenue(createRevenueCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: RevenueResponse })
  async updateRevenue(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateRevenueCommand: UpdateRevenueCommand,
  ) {
    updateRevenueCommand.currentUser = currentUser;
    updateRevenueCommand.id = id;
    return this.command.updateRevenue(updateRevenueCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: RevenueResponse })
  async archiveRevenue(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveRevenueCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveRevenue(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteRevenue(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteRevenue(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: RevenueResponse })
  async restoreRevenue(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreRevenue(id, currentUser);
  }
}
