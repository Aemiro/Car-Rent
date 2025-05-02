import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserInfo } from '@lib/common/user-info';
import { FeedbackCommand } from '@interaction/usecases/feedbacks/feedback.usecase.command';
import { FeedbackQuery } from '@interaction/usecases/feedbacks/feedback.usecase.query';
import { FeedbackResponse } from '@interaction/usecases/feedbacks/feedback.response';
import { CreateFeedbackCommand, ArchiveFeedbackCommand } from '@interaction/usecases/feedbacks/feedback.command';
import { AllowAnonymous } from '@auth/decorators/allow-anonymous.decorator';

@Controller('feedbacks')
@ApiTags('feedbacks')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class FeedbackController {
  constructor(
    private command: FeedbackCommand,
    private feedbackQuery: FeedbackQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: FeedbackResponse })
  async getFeedback(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.feedbackQuery.getFeedback(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(FeedbackResponse)
  async getFeedbacks(@Query() query: CollectionQuery) {
    return this.feedbackQuery.getFeedbacks(query);
  }
  @Post()
  @ApiOkResponse({ type: FeedbackResponse })
  @AllowAnonymous()
  async createFeedback(
    @Body() createFeedbackCommand: CreateFeedbackCommand,
  ) {
    return this.command.createFeedback(createFeedbackCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: FeedbackResponse })
  async archiveFeedback(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveFeedbackCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveFeedback(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteFeedback(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteFeedback(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: FeedbackResponse })
  async restoreFeedback(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreFeedback(id, currentUser);
  }
}
