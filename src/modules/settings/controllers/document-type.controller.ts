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
import { DocumentTypeCommand } from '@setting/usecases/document-types/document-type.usecase.command';
import {
  ArchiveDocumentTypeCommand,
  CreateDocumentTypeCommand,
  UpdateDocumentTypeCommand,
} from '@setting/usecases/document-types/document-type.commands';
import { DocumentTypeResponse } from '@setting/usecases/document-types/document-type.response';
import { DocumentTypeQuery } from '@setting/usecases/document-types/document-type.usecase.query';

@Controller('document-types')
@ApiTags('document-types')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class DocumentTypeController {
  constructor(
    private command: DocumentTypeCommand,
    private documentTypeQuery: DocumentTypeQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: DocumentTypeResponse })
  async getDocumentType(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.documentTypeQuery.getDocumentType(
      id,
      includeQuery.includes,
      true,
    );
  }
  @Get()
  @ApiPaginatedResponse(DocumentTypeResponse)
  async getDocumentTypes(@Query() query: CollectionQuery) {
    return this.documentTypeQuery.getDocumentTypes(query);
  }
  @Post()
  @ApiOkResponse({ type: DocumentTypeResponse })
  async createDocumentType(
    @CurrentUser() currentUser: UserInfo,
    @Body() createDocumentTypeCommand: CreateDocumentTypeCommand,
  ) {
    createDocumentTypeCommand.currentUser = currentUser;
    return this.command.createDocumentType(createDocumentTypeCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: DocumentTypeResponse })
  async updateDocumentType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateDocumentTypeCommand: UpdateDocumentTypeCommand,
  ) {
    updateDocumentTypeCommand.currentUser = currentUser;
    updateDocumentTypeCommand.id = id;
    return this.command.updateDocumentType(updateDocumentTypeCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: DocumentTypeResponse })
  async archiveDocumentType(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveDocumentTypeCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveDocumentType(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteDocumentType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteDocumentType(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: DocumentTypeResponse })
  async restoreDocumentType(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreDocumentType(id, currentUser);
  }
}
