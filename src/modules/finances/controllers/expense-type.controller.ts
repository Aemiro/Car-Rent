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
  CreateExpenseTypeCommand,
  UpdateExpenseTypeCommand,
  ArchiveExpenseTypeCommand,
} from '@finance/usecases/expense-types/expense-type.commands';
import { ExpenseTypeResponse } from '@finance/usecases/expense-types/expense-type.response';
import { ExpenseTypeCommand } from '@finance/usecases/expense-types/expense-type.usecase.command';
import { ExpenseTypeQuery } from '@finance/usecases/expense-types/expense-type.usecase.query';

@Controller('expense-types')
@ApiTags('expense-types')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class ExpenseTypeController {
  constructor(
    private command: ExpenseTypeCommand,
    private expenseTypeQuery: ExpenseTypeQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: ExpenseTypeResponse })
  async getExpenseType(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.expenseTypeQuery.getExpenseType(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(ExpenseTypeResponse)
  async getExpenseTypes(@Query() query: CollectionQuery) {
    return this.expenseTypeQuery.getExpenseTypes(query);
  }
  @Post()
  @ApiOkResponse({ type: ExpenseTypeResponse })
  async createExpenseType(
    @CurrentUser() currentUser: UserInfo,
    @Body() createExpenseTypeCommand: CreateExpenseTypeCommand,
  ) {
    createExpenseTypeCommand.currentUser = currentUser;
    return this.command.createExpenseType(createExpenseTypeCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: ExpenseTypeResponse })
  async updateExpenseType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateExpenseTypeCommand: UpdateExpenseTypeCommand,
  ) {
    updateExpenseTypeCommand.currentUser = currentUser;
    updateExpenseTypeCommand.id = id;
    return this.command.updateExpenseType(updateExpenseTypeCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: ExpenseTypeResponse })
  async archiveExpenseType(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveExpenseTypeCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveExpenseType(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteExpenseType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteExpenseType(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: ExpenseTypeResponse })
  async restoreExpenseType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreExpenseType(id, currentUser);
  }
}
