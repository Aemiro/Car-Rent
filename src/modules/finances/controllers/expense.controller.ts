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
  CreateExpenseCommand,
  UpdateExpenseCommand,
  ArchiveExpenseCommand,
} from '@finance/usecases/expenses/expense.commands';
import { ExpenseResponse } from '@finance/usecases/expenses/expense.response';
import { ExpenseCommand } from '@finance/usecases/expenses/expense.usecase.command';
import { ExpenseQuery } from '@finance/usecases/expenses/expense.usecase.query';

@Controller('expenses')
@ApiTags('expenses')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class ExpenseController {
  constructor(
    private command: ExpenseCommand,
    private expenseQuery: ExpenseQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: ExpenseResponse })
  async getExpense(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.expenseQuery.getExpense(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(ExpenseResponse)
  async getExpenses(@Query() query: CollectionQuery) {
    return this.expenseQuery.getExpenses(query);
  }
  @Post()
  @ApiOkResponse({ type: ExpenseResponse })
  async createExpense(
    @CurrentUser() currentUser: UserInfo,
    @Body() createExpenseCommand: CreateExpenseCommand,
  ) {
    createExpenseCommand.currentUser = currentUser;
    return this.command.createExpense(createExpenseCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: ExpenseResponse })
  async updateExpense(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateExpenseCommand: UpdateExpenseCommand,
  ) {
    updateExpenseCommand.currentUser = currentUser;
    updateExpenseCommand.id = id;
    return this.command.updateExpense(updateExpenseCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: ExpenseResponse })
  async archiveExpense(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveExpenseCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveExpense(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteExpense(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteExpense(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: ExpenseResponse })
  async restoreExpense(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreExpense(id, currentUser);
  }
}
