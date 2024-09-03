import {
  ArchiveTenantCommand,
  CreateTenantCommand,
  UpdateTenantCommand,
} from './tenant.commands';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantResponse } from './tenant.response';
import { TenantRepository } from '../../persistence/tenants/tenant.repository';
import { UserInfo } from '@lib/common/user-info';
import { FileDto } from '@lib/common/file-dto';
import {
  AddTenantContactCommand,
  RemoveTenantContactCommand,
  UpdateTenantContactCommand,
} from './tenant-contact.command';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAccountCommand } from '@auth/usecases/accounts/account.commands';
import { Util } from '@lib/common/util';
import {
  AddTenantDocumentCommand,
  UpdateTenantDocumentCommand,
  RemoveTenantDocumentCommand,
} from './tenant-document.command';
@Injectable()
export class TenantCommand {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private eventEmitter: EventEmitter2,
  ) {}
  async createTenant(command: CreateTenantCommand): Promise<TenantResponse> {
    if (await this.tenantRepository.getOneBy('name', command.name, [], true)) {
      throw new BadRequestException(`Tenant already exist with this name`);
    }
    if (
      await this.tenantRepository.getOneBy('email', command.email, [], true)
    ) {
      throw new BadRequestException(`Tenant already exist with this email`);
    }
    if (
      await this.tenantRepository.getOneBy('phone', command.phone, [], true)
    ) {
      throw new BadRequestException(`Tenant already exist with this phone`);
    }
    if (command.website) {
      if (
        await this.tenantRepository.getOneBy(
          'website',
          command.website,
          [],
          true,
        )
      ) {
        throw new BadRequestException(`Tenant already exist with this website`);
      }
    }
    const tenantDomain = CreateTenantCommand.toEntity(command);
    tenantDomain.createdBy = command?.currentUser?.id;
    tenantDomain.updatedBy = command?.currentUser?.id;
    const tenant = await this.tenantRepository.insert(tenantDomain);
    if (tenant) {
      const password = command.password;
      const createAccountCommand = new CreateAccountCommand();
      createAccountCommand.email = command.email;
      createAccountCommand.phone = command.phone;
      createAccountCommand.name = command.name;
      createAccountCommand.accountId = tenant.id;
      createAccountCommand.type = 'Tenant';
      createAccountCommand.isActive = true;
      createAccountCommand.address = command.address;
      createAccountCommand.gender = null;
      createAccountCommand.password = Util.hashPassword(password);
      this.eventEmitter.emit('create.account', createAccountCommand);
    }
    return TenantResponse.toResponse(tenant);
  }
  async updateTenant(command: UpdateTenantCommand): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(command.id);
    if (!tenant) {
      throw new NotFoundException(`Tenant not found with id ${command.id}`);
    }
    if (tenant.name !== command.name) {
      const user = await this.tenantRepository.getOneBy(
        'name',
        command.name,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Tenant already exist with this name`);
      }
    }
    if (tenant.email !== command.email) {
      const user = await this.tenantRepository.getOneBy(
        'email',
        command.email,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Tenant already exist with this email`);
      }
    }
    if (tenant.phone !== command.phone) {
      const user = await this.tenantRepository.getOneBy(
        'phone',
        command.phone,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Tenant already exist with this phone`);
      }
    }
    if (command.website && tenant.website !== command.website) {
      const user = await this.tenantRepository.getOneBy(
        'website',
        command.website,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(`Tenant already exist with this website`);
      }
    }
    tenant.name = command.name;
    tenant.website = command.website;
    tenant.note = command.note;
    tenant.email = command.email;
    tenant.phone = command.phone;
    tenant.address = command.address;
    tenant.updatedBy = command?.currentUser?.id;
    const result = await this.tenantRepository.save(tenant);
    if (tenant) {
      this.eventEmitter.emit('update.account', {
        accountId: tenant.id,
        name: command.name,
        email: tenant.email,
        type: 'Employee',
        phone: tenant.phone,
        address: tenant.address,
        gender: null,
        profilePicture: tenant.logo,
      });
    }
    return TenantResponse.toResponse(result);
  }
  async archiveTenant(command: ArchiveTenantCommand): Promise<TenantResponse> {
    const tenantDomain = await this.tenantRepository.getById(command.id);
    if (!tenantDomain) {
      throw new NotFoundException(`Tenant not found with id ${command.id}`);
    }
    tenantDomain.deletedAt = new Date();
    tenantDomain.deletedBy = command?.currentUser?.id;
    const result = await this.tenantRepository.save(tenantDomain);
    if (result) {
      this.eventEmitter.emit('account.archived', {
        phone: tenantDomain.phone,
        id: tenantDomain.id,
      });
    }
    return TenantResponse.toResponse(result);
  }
  async restoreTenant(
    id: string,
    currentUser: UserInfo,
  ): Promise<TenantResponse> {
    const tenantDomain = await this.tenantRepository.getById(id, [], true);
    if (!tenantDomain) {
      throw new NotFoundException(`Tenant not found with id ${id}`);
    }
    const result = await this.tenantRepository.restore(id);

    if (result) {
      tenantDomain.deletedAt = null;
      this.eventEmitter.emit('account.restored', {
        phone: tenantDomain.phone,
        id: tenantDomain.id,
      });
    }
    return TenantResponse.toResponse(tenantDomain);
  }
  async deleteTenant(id: string, currentUser: UserInfo): Promise<boolean> {
    const tenantDomain = await this.tenantRepository.getById(id, [], true);
    if (!tenantDomain) {
      throw new NotFoundException(`Tenant not found with id ${id}`);
    }
    const result = await this.tenantRepository.delete(id);
    if (result) {
      if (tenantDomain.logo) {
        Util.deleteFile(
          `${process.env.UPLOADED_FILES_DESTINATION}/${tenantDomain.logo.name}`,
        );
      }
      this.eventEmitter.emit('account.deleted', {
        phone: tenantDomain.phone,
        id: tenantDomain.id,
      });
    }
    return result;
  }
  async updateTenantLogo(
    id: string,
    currentUser: UserInfo,
    logo: FileDto,
  ): Promise<TenantResponse> {
    const tenant = await this.tenantRepository.getById(id);
    if (!tenant) {
      throw new NotFoundException(`Tenant not found with id ${id}`);
    }
    tenant.updatedBy = currentUser?.id;
    tenant.logo = logo;
    const result = await this.tenantRepository.save(tenant);
    if (result) {
      this.eventEmitter.emit('update-account-profile', {
        id: result.id,
        profilePicture: result.logo,
      });
    }
    return TenantResponse.toResponse(result);
  }
  // contacts
  async addContact(payload: AddTenantContactCommand) {
    const tenant = await this.tenantRepository.getById(
      payload.tenantId,
      ['contacts'],
      true,
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    const contactEntity = AddTenantContactCommand.toEntity(payload);
    tenant.addContact(contactEntity);
    const updatedTenant = await this.tenantRepository.save(tenant);
    return TenantResponse.toResponse(updatedTenant);
  }
  async updateContact(payload: UpdateTenantContactCommand) {
    const tenant = await this.tenantRepository.getById(
      payload.tenantId,
      ['contacts'],
      true,
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    let contact = tenant.contacts.find(
      (tenantContact) => tenantContact.id === payload.id,
    );
    if (!contact) throw new NotFoundException('Contact not found');
    contact = { ...contact, ...payload };
    contact.updatedBy = payload?.currentUser?.id;
    tenant.updateContact(contact);
    const updatedTenant = await this.tenantRepository.save(tenant);
    return TenantResponse.toResponse(updatedTenant);
  }
  async removeContact(payload: RemoveTenantContactCommand) {
    const tenant = await this.tenantRepository.getById(
      payload.tenantId,
      ['contacts'],
      true,
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    const contact = tenant.contacts.find(
      (tenantContact) => tenantContact.id === payload.id,
    );
    if (!contact) throw new NotFoundException('Contact not found');
    tenant.removeContact(contact.id);
    const result = await this.tenantRepository.save(tenant);
    return TenantResponse.toResponse(result);
  }

  // documents
  async addDocument(payload: AddTenantDocumentCommand) {
    const tenant = await this.tenantRepository.getById(
      payload.tenantId,
      ['documents'],
      true,
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    const documentEntity = AddTenantDocumentCommand.toEntity(payload);
    tenant.addDocument(documentEntity);
    const updatedTenant = await this.tenantRepository.save(tenant);
    return TenantResponse.toResponse(updatedTenant);
  }
  async updateDocument(payload: UpdateTenantDocumentCommand) {
    const tenant = await this.tenantRepository.getById(
      payload.tenantId,
      ['documents'],
      true,
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    let document = tenant.documents.find(
      (tenantDocument) => tenantDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    document = { ...document, ...payload };
    document.updatedBy = payload?.currentUser?.id;
    tenant.updateDocument(document);
    const updatedTenant = await this.tenantRepository.save(tenant);
    return TenantResponse.toResponse(updatedTenant);
  }
  async removeDocument(payload: RemoveTenantDocumentCommand) {
    const tenant = await this.tenantRepository.getById(
      payload.tenantId,
      ['documents'],
      true,
    );
    if (!tenant) throw new NotFoundException('Tenant not found');
    const document = tenant.documents.find(
      (tenantDocument) => tenantDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    tenant.removeDocument(document.id);
    const result = await this.tenantRepository.save(tenant);
    return TenantResponse.toResponse(result);
  }
}
