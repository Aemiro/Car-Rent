import { CollectionQuery } from '@lib/collection-query/collection-query';
import { FilterOperators } from '@lib/collection-query/filter_operators';
import { QueryConstructor } from '@lib/collection-query/query-constructor';
import { DataResponseFormat } from '@lib/response-format/data-response-format';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/auth/persistence/accounts/account.entity';
import { RoleEntity } from 'modules/auth/persistence/roles/role.entity';
import { Repository } from 'typeorm';
import { RoleResponse } from '../roles/role.response';
import { AccountResponse } from './account.response';
import { UserRoleEntity } from 'modules/auth/persistence/accounts/user-role.entity';
import { UserRoleResponse } from './user-role.response';

@Injectable()
export class AccountQuery {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(UserRoleEntity)
    private accountRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
  ) {}
  async getAccount(id: string): Promise<AccountResponse> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: [],
    });
    if (!account) {
      throw new NotFoundException(`Account not found with id ${id}`);
    }
    return AccountResponse.toResponse(account);
  }
  async getAccounts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountResponse>> {
    const dataQuery = QueryConstructor.constructQuery<AccountEntity>(
      this.accountRepository,
      query,
    );
    const d = new DataResponseFormat<AccountResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getArchivedAccounts(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<AccountResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<AccountEntity>(
      this.accountRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<AccountResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => AccountResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getAccountRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<UserRoleResponse>> {
    const dataQuery = QueryConstructor.constructQuery<UserRoleEntity>(
      this.accountRoleRepository,
      query,
    );
    const d = new DataResponseFormat<UserRoleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => UserRoleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getAccountRole(id: string): Promise<UserRoleResponse> {
    const accountRole = await this.accountRoleRepository.findOne({
      where: { id },
    });
    if (!accountRole) {
      throw new NotFoundException(`Account role not found with id ${id}`);
    }
    return UserRoleResponse.toResponse(accountRole);
  }
  async getArchivedAccountRoles(
    query: CollectionQuery,
  ): Promise<DataResponseFormat<UserRoleResponse>> {
    if (!query.filter) {
      query.filter = [];
    }
    query.filter.push([
      {
        field: 'deleted_at',
        operator: FilterOperators.NotNull,
      },
    ]);
    const dataQuery = QueryConstructor.constructQuery<UserRoleEntity>(
      this.accountRoleRepository,
      query,
    );
    dataQuery.withDeleted();
    const d = new DataResponseFormat<UserRoleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => UserRoleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  //Account Permission
  async getRolesByAccountId(
    accountId: string,
    query: CollectionQuery,
  ): Promise<DataResponseFormat<RoleResponse>> {
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    )
      .innerJoin('roles.userRoles', 'userRoles')
      .andWhere('userRoles.account_id = :q', {
        q: accountId,
      })
      .distinct(true);
    //console.log(dataQuery.getSql(), dataQuery.getParameters());
    const d = new DataResponseFormat<RoleResponse>();
    if (query.count) {
      d.total = await dataQuery.getCount();
    } else {
      const [result, total] = await dataQuery.getManyAndCount();
      d.data = result.map((entity) => RoleResponse.toResponse(entity));
      d.total = total;
    }
    return d;
  }
  async getRoles(
    accountId: string,
    query: CollectionQuery,
  ): Promise<RoleResponse[]> {
    const dataQuery = QueryConstructor.constructQuery<RoleEntity>(
      this.roleRepository,
      query,
    )
      .innerJoin('roles.userRoles', 'userRoles')
      .andWhere('userRoles.account_id = :q', {
        q: accountId,
      })
      .distinct(true);
    //console.log(dataQuery.getSql(), dataQuery.getParameters());
    const result = await dataQuery.getMany();
    return result.map((entity) => RoleResponse.toResponse(entity));
  }
}
