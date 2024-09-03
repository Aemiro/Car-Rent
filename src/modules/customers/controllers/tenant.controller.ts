import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateTenantCommand,
  UpdateTenantCommand,
  ArchiveTenantCommand,
} from '../usecases/tenants/tenant.commands';
import { TenantResponse } from '../usecases/tenants/tenant.response';
import { TenantCommand } from '../usecases/tenants/tenant.usecase.command';
import { TenantQuery } from '../usecases/tenants/tenant.usecase.query';
import {
  IncludeQuery,
  CollectionQuery,
} from '@lib/collection-query/collection-query';
import { ApiPaginatedResponse } from '@lib/response-format/api-paginated-response';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'modules/auth/decorators/current-user.decorator';
import { UserInfo } from '@lib/common/user-info';
import { FileDto } from '@lib/common/file-dto';
import { diskStorage } from 'multer';
import {
  AddTenantContactCommand,
  RemoveTenantContactCommand,
  UpdateTenantContactCommand,
} from '@customer/usecases/tenants/tenant-contact.command';
import {
  AddTenantDocumentCommand,
  RemoveTenantDocumentCommand,
  UpdateTenantDocumentCommand,
} from '@customer/usecases/tenants/tenant-document.command';

@Controller('tenants')
@ApiTags('tenants')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class TenantController {
  constructor(
    private command: TenantCommand,
    private tenantQuery: TenantQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: TenantResponse })
  async getTenant(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.tenantQuery.getTenant(id, includeQuery.includes, true);
  }

  @Get()
  @ApiPaginatedResponse(TenantResponse)
  async getTenants(@Query() query: CollectionQuery) {
    return this.tenantQuery.getTenants(query);
  }
  @Post()
  @ApiOkResponse({ type: TenantResponse })
  async createTenant(@Body() createTenantCommand: CreateTenantCommand) {
    return this.command.createTenant(createTenantCommand);
  }
  @Put()
  @ApiOkResponse({ type: TenantResponse })
  async updateTenant(
    @CurrentUser() currentUser: UserInfo,
    @Body() updateTenantCommand: UpdateTenantCommand,
  ) {
    updateTenantCommand.currentUser = currentUser;
    return this.command.updateTenant(updateTenantCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: TenantResponse })
  async archiveTenant(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveTenantCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveTenant(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteTenant(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteTenant(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: TenantResponse })
  async restoreTenant(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreTenant(id, currentUser);
  }
  @Post('update-logo')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: process.env.UPLOADED_FILES_DESTINATION,
      }),
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid Image File'),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: Math.pow(1024, 5) },
    }),
  )
  @ApiOkResponse({ type: TenantResponse })
  async updateTenantLogo(
    @CurrentUser() currentUser: UserInfo,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    if (logo) {
      const fileInfo: FileDto = {
        name: logo.filename,
        path: logo?.path,
        originalName: logo.originalname,
        type: logo.mimetype,
        size: logo.size,
      };
      return this.command.updateTenantLogo(
        currentUser.id,
        currentUser,
        fileInfo,
      );
    }
    throw new BadRequestException(`Bad Request`);
  }
  // contacts
  @Post('create-contact')
  @ApiOkResponse({ type: TenantResponse })
  async addTenantContact(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddTenantContactCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addContact(command);
  }
  @Put('update-contact')
  @ApiOkResponse({ type: TenantResponse })
  async updateTenantContact(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdateTenantContactCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateContact(command);
  }
  @Post('remove-contact')
  @ApiOkResponse({ type: TenantResponse })
  async archiveTenantContact(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemoveTenantContactCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeContact(command);
  }
  // documents
  @Post('add-document')
  @ApiOkResponse({ type: TenantResponse })
  async createDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddTenantDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addDocument(command);
  }
  @Put('update-document')
  @ApiOkResponse({ type: TenantResponse })
  async updateDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdateTenantDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateDocument(command);
  }
  @Post('remove-document')
  @ApiOkResponse({ type: TenantResponse })
  async archiveDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemoveTenantDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeDocument(command);
  }
}
