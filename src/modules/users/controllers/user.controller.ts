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
  CreateUserCommand,
  UpdateUserCommand,
  ArchiveUserCommand,
} from '../usecases/users/user.commands';
import { UserResponse } from '../usecases/users/user.response';
import { UserCommand } from '../usecases/users/user.usecase.command';
import { UserQuery } from '../usecases/users/user.usecase.query';
import {
  IncludeQuery,
  CollectionQuery,
} from '@lib/collection-query/collection-query';
import { ApiPaginatedResponse } from '@lib/response-format/api-paginated-response';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'modules/auth/decorators/current-user.decorator';
import { diskStorage } from 'multer';
import { UserInfo } from '@lib/common/user-info';
import { FileDto } from '@lib/common/file-dto';
import {
  AddUserDocumentCommand,
  UpdateUserDocumentCommand,
  RemoveUserDocumentCommand,
} from '@user/usecases/users/user-document.command';
@Controller('users')
@ApiTags('users')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class UserController {
  constructor(
    private command: UserCommand,
    private userQuery: UserQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: UserResponse })
  async getUser(@Param('id') id: string, @Query() includeQuery: IncludeQuery) {
    return this.userQuery.getUser(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(UserResponse)
  async getUsers(@Query() query: CollectionQuery) {
    return this.userQuery.getUsers(query);
  }
  @Post()
  @ApiOkResponse({ type: UserResponse })
  async createUser(
    @CurrentUser() currentUser: UserInfo,
    @Body() createUserCommand: CreateUserCommand,
  ) {
    createUserCommand.currentUser = currentUser;
    return this.command.createUser(createUserCommand);
  }
  @Put()
  @ApiOkResponse({ type: UserResponse })
  async updateUser(
    @CurrentUser() currentUser: UserInfo,
    @Body() updateUserCommand: UpdateUserCommand,
  ) {
    updateUserCommand.currentUser = currentUser;
    return this.command.updateUser(updateUserCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: UserResponse })
  async archiveUser(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveUserCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveUser(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteUser(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteUser(id, currentUser);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: UserResponse })
  async restoreUser(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreUser(id, currentUser);
  }
  @Post('update-user-profile-image/:id')
  @UseInterceptors(
    FileInterceptor('profileImage', {
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
      limits: { fileSize: Math.pow(1024, 2) },
    }),
  )
  @ApiOkResponse({ type: UserResponse })
  async updateUserProfileImage(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      const fileInfo: FileDto = {
        name: profileImage.filename,
        path: profileImage?.path,
        originalName: profileImage.originalname,
        type: profileImage.mimetype,
        size: profileImage.size,
      };
      return this.command.updateUserProfile(id, currentUser, fileInfo);
    }
    throw new BadRequestException(`Bad Request`);
  }
  @Post('update-profile-image')
  @UseInterceptors(
    FileInterceptor('profileImage', {
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
      limits: { fileSize: Math.pow(1024, 2) },
    }),
  )
  @ApiOkResponse({ type: UserResponse })
  async updateMyProfileImage(
    @CurrentUser() currentUser: UserInfo,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      const fileInfo: FileDto = {
        name: profileImage.filename,
        path: profileImage?.path,
        originalName: profileImage.originalname,
        type: profileImage.mimetype,
        size: profileImage.size,
      };
      return this.command.updateUserProfile(
        currentUser.id,
        currentUser,
        fileInfo,
      );
    }
    throw new BadRequestException(`Bad Request`);
  }
  // documents
  @Post('add-document')
  @ApiOkResponse({ type: UserResponse })
  async addDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddUserDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addDocument(command);
  }
  @Put('update-document')
  @ApiOkResponse({ type: UserResponse })
  async updateDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdateUserDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateDocument(command);
  }
  @Post('remove-document')
  @ApiOkResponse({ type: UserResponse })
  async archiveDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemoveUserDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeDocument(command);
  }
}
