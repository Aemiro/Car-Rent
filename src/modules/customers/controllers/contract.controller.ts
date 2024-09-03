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
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserInfo } from '@lib/common/user-info';
import {
  ArchiveContractCommand,
  CreateContractCommand,
  UpdateContractCommand,
} from '@customer/usecases/contracts/contract.commands';
import { ContractResponse } from '@customer/usecases/contracts/contract.response';
import { ContractCommand } from '@customer/usecases/contracts/contract.usecase.command';
import { ContractQuery } from '@customer/usecases/contracts/contract.usecase.query';
import {
  AddContractDocumentCommand,
  UpdateContractDocumentCommand,
  RemoveContractDocumentCommand,
} from '@customer/usecases/contracts/contract-document.command';

@Controller('contracts')
@ApiTags('contracts')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class ContractController {
  constructor(
    private command: ContractCommand,
    private contractQuery: ContractQuery,
  ) {}
  @Get(':id')
  @ApiOkResponse({ type: ContractResponse })
  async getContract(
    @Param('id') id: string,
    @Query() includeQuery: IncludeQuery,
  ) {
    return this.contractQuery.getContract(id, includeQuery.includes, true);
  }
  @Get()
  @ApiPaginatedResponse(ContractResponse)
  async getContracts(@Query() query: CollectionQuery) {
    return this.contractQuery.getContracts(query);
  }
  @Post('create-contract')
  @ApiOkResponse({ type: ContractResponse })
  async createContract(
    @CurrentUser() currentUser: UserInfo,
    @Body() createContractCommand: CreateContractCommand,
  ) {
    createContractCommand.currentUser = currentUser;
    return this.command.createContract(createContractCommand);
  }
  @Put(':id')
  @ApiOkResponse({ type: ContractResponse })
  async updateContract(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
    @Body() updateContractCommand: UpdateContractCommand,
  ) {
    updateContractCommand.currentUser = currentUser;
    updateContractCommand.id = id;
    return this.command.updateContract(updateContractCommand);
  }
  @Delete('archive')
  @ApiOkResponse({ type: ContractResponse })
  async archiveContract(
    @CurrentUser() currentUser: UserInfo,
    @Body() archiveCommand: ArchiveContractCommand,
  ) {
    archiveCommand.currentUser = currentUser;
    return this.command.archiveContract(archiveCommand);
  }
  @Delete(':id')
  @ApiOkResponse({ type: Boolean })
  async deleteContract(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.deleteContract(id, null);
  }
  @Post('restore/:id')
  @ApiOkResponse({ type: ContractResponse })
  async restoreContract(
    @CurrentUser() currentUser: UserInfo,
    @Param('id') id: string,
  ) {
    return this.command.restoreContract(id, null);
  }
  // documents
  @Post('add-document')
  @ApiOkResponse({ type: ContractResponse })
  async addDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: AddContractDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.addDocument(command);
  }
  @Put('update-document')
  @ApiOkResponse({ type: ContractResponse })
  async updateDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: UpdateContractDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.updateDocument(command);
  }
  @Post('remove-document')
  @ApiOkResponse({ type: ContractResponse })
  async archiveDocument(
    @CurrentUser() currentUser: UserInfo,
    @Body() command: RemoveContractDocumentCommand,
  ) {
    command.currentUser = currentUser;
    return this.command.removeDocument(command);
  }
}
