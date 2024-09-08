import { AccountResponse } from './account.response';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from 'modules/auth/persistence/accounts/account.repository';
import { UserRoleEntity } from 'modules/auth/persistence/accounts/user-role.entity';
import { Repository } from 'typeorm';
import { RoleQuery } from '../roles/role.usecase.query';
import { RoleRepository } from 'modules/auth/persistence/roles/role.repository';
import { CreateAccountCommand, UpdateAccountCommand } from './account.commands';
import { UserRoleResponse } from './user-role.response';
import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { RoleResponse } from '../roles/role.response';
import {
  CreateAccountRolesCommand,
  CreateAccountRoleCommand,
  UpdateAccountRoleCommand,
  DeleteAccountRoleCommand,
  ArchiveAccountRoleCommand,
} from './account-role.commands';
import { RoleEntity } from 'modules/auth/persistence/roles/role.entity';
@Injectable()
export class AccountCommand {
  constructor(
    private accountRepository: AccountRepository,
    @InjectRepository(UserRoleEntity)
    private accountRoleRepository: Repository<UserRoleEntity>,
    private roleQueries: RoleQuery,
    private roleRepository: RoleRepository,
  ) {}
  @OnEvent('create.account')
  async createAccount(command: CreateAccountCommand): Promise<AccountResponse> {
    const accountDomain = CreateAccountCommand.toEntity(command);
    const existingAccount = await this.accountRepository.getByPhoneNumber(
      accountDomain.phone,
      true,
    );
    console.log(existingAccount);
    if (!existingAccount) {
      const account = await this.accountRepository.insert(accountDomain);
      console.log('account', account);

      if (account.type !== 'Employee') {
        let role = await this.roleRepository.getOneBy('key', account.type);
        if (!role) {
          const roleName = `${account.type[0].toUpperCase()}${account.type.slice(
            1,
            account.type.length,
          )}`;
          role = await this.roleRepository.insert({
            name: roleName,
            key: account.type,
          } as RoleEntity);
        }
        const accountRoleCommand: CreateAccountRolesCommand = {
          accountId: account.id,
          roles: [role.id],
        };
        await this.seedAccountRole(accountRoleCommand);
      }
      return AccountResponse.toResponse(account);
    }
    return AccountResponse.toResponse(accountDomain);
  }
  @OnEvent('update.account')
  async updateAccount(command: UpdateAccountCommand): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getByAccountId(
      command.accountId,
    );
    if (accountDomain) {
      accountDomain.name = command.name;
      accountDomain.email = command.email;
      accountDomain.phone = command.phone;
      accountDomain.gender = command.gender;
      accountDomain.address = command.address;
      accountDomain.profilePicture = command.profilePicture
        ? command.profilePicture
        : accountDomain.profilePicture;
      accountDomain.isActive = command.isActive
        ? command.isActive
        : accountDomain.isActive;
      const account = await this.accountRepository.update(accountDomain);
      return AccountResponse.toResponse(account);
    }
    return null;
  }
  async archiveAccount(id: string): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(id);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    return await this.accountRepository.archive(id);
  }
  async restoreAccount(id: string): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(id, true);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    const r = await this.accountRepository.restore(id);
    if (r) {
      accountDomain.deletedAt = null;
    }
    return AccountResponse.toResponse(accountDomain);
  }
  async deleteAccount(id: string): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(id);
    if (!accountDomain) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    return await this.accountRepository.delete(id);
  }
  @OnEvent('account.deleted')
  async handleDeleteAccount(command: { phoneNumber: string; id: string }) {
    const existingAccount = await this.accountRepository.getById(
      command.id,
      true,
    );
    if (existingAccount) {
      await this.accountRepository.delete(existingAccount.id);
    }
  }
  @OnEvent('account.archived')
  async handleArchiveAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, true);
    if (account) {
      account.deletedAt = new Date();
      await this.accountRepository.update(account);
    }
  }
  @OnEvent('account.restored')
  async handleRestoreAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, true);
    if (account) {
      account.deletedAt = null;
      account.deletedBy = null;
      await this.accountRepository.update(account);
    }
  }
  @OnEvent('account.activate-or-block')
  async activateOrBlockAccount(command: { phoneNumber: string; id: string }) {
    const account = await this.accountRepository.getById(command.id, true);
    if (account) {
      account.isActive = !account.isActive;
      // console.log(account.isActive);
      await this.accountRepository.update(account);
    }
  }
  // @OnEvent('send.email.credential')
  // sendEmailCredential(command: {
  //   name: string;
  //   email: string;
  //   phoneNumber: string;
  //   password: string;
  // }) {
  //   // this.emailServiceClient.emit('send-email-credential', command);
  // }
  // @OnEvent('reset-password')
  // sendResetPasswordEmailLink(command: {
  //   name: string;
  //   email: string;
  //   url: string;
  // }) {
  //   // this.emailServiceClient.emit('reset-password', command);
  // }
  async addAccountRole(
    command: CreateAccountRolesCommand,
  ): Promise<RoleResponse[]> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        ` Account does not found with id ${command.accountId}`,
      );
    }
    accountDomain.userRoles = [];
    for (const roleId of command.roles) {
      const accountRole = CreateAccountRoleCommand.toEntity({
        roleId: roleId,
        accountId: command.accountId,
      });
      accountDomain.addUserRole(accountRole);
    }
    const result = await this.accountRepository.update(accountDomain);
    if (!result) return null;
    if (result.userRoles.length === 0) return [];
    const roleIds = result.userRoles.map((role) => role.roleId);

    const query = new CollectionQuery();
    query.filter = [
      [
        {
          field: 'id',
          operator: FilterOperators.In,
          value: roleIds.join(','),
        },
      ],
    ];
    const permissionResponseData = await this.roleQueries.getRoles(query);
    return permissionResponseData.data;
  }
  async seedAccountRole(
    command: CreateAccountRolesCommand,
  ): Promise<AccountResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (accountDomain) {
      accountDomain.userRoles = [];
      for (const roleId of command.roles) {
        const accountRole = CreateAccountRoleCommand.toEntity({
          roleId: roleId,
          accountId: command.accountId,
        });
        accountDomain.addUserRole(accountRole);
      }
      const result = await this.accountRepository.update(accountDomain);
      return AccountResponse.toResponse(result);
    }
    return null;
  }
  async updateAccountRole(
    command: UpdateAccountRoleCommand,
  ): Promise<UserRoleResponse> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        `Account does not found with id ${command.accountId}`,
      );
    }
    const oldPayload = accountDomain.userRoles.find((b) => b.id === command.id);
    if (oldPayload) {
      throw new BadRequestException(`Role already assigned to this account`);
    }

    const accountRole = UpdateAccountRoleCommand.toEntity(command);
    accountDomain.updateUserRole(accountRole);
    const result = await this.accountRepository.update(accountDomain);
    if (!result) return null;

    const response = UserRoleResponse.toResponse(
      result.userRoles.find((accountRole) => accountRole.id === command.id),
    );
    return response;
  }
  async deleteAccountRole(command: DeleteAccountRoleCommand): Promise<boolean> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { roleId: command.roleId, userId: command.accountId },
      withDeleted: true,
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found`);
    }
    const result = await this.accountRoleRepository.delete({
      id: accountRole.id,
    });
    return result ? true : false;
  }
  async archiveAccountRole(
    command: ArchiveAccountRoleCommand,
  ): Promise<boolean> {
    const accountDomain = await this.accountRepository.getById(
      command.accountId,
    );
    if (!accountDomain) {
      throw new NotFoundException(
        `Account does not found with id ${command.accountId}`,
      );
    }
    const accountRole = accountDomain.userRoles.find(
      (accountRole) => accountRole.id === command.id,
    );
    accountRole.deletedAt = new Date();
    accountRole.deletedBy = command.currentUser.id;
    accountDomain.updateUserRole(accountRole);
    const result = await this.accountRepository.update(accountDomain);

    return result ? true : false;
  }
  async restoreAccountRole(
    command: DeleteAccountRoleCommand,
  ): Promise<UserRoleResponse> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { roleId: command.roleId, userId: command.accountId },
      withDeleted: true,
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found`);
    }
    accountRole.deletedAt = null;
    const result = await this.accountRoleRepository.save(accountRole);
    return UserRoleResponse.toResponse(result);
  }

  @OnEvent('update-account-profile')
  async updateAccountProfile(profileInfo): Promise<void> {
    const accountDomain = await this.accountRepository.getByAccountId(
      profileInfo.id,
    );
    if (accountDomain) {
      accountDomain.profilePicture = profileInfo.profilePicture;
      await this.accountRepository.update(accountDomain);
    }
  }
}
