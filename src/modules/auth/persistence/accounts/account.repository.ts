import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from './account.entity';
import { IAccountRepository } from './account.repository.interface';
@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
  ) {}
  async insert(account: AccountEntity): Promise<AccountEntity> {
    const result = await this.accountRepository.save(account);
    return result ? result : null;
  }
  async update(account: AccountEntity): Promise<AccountEntity> {
    const result = await this.accountRepository.save(account);
    return result ? result : null;
  }
  async delete(id: string): Promise<boolean> {
    const result = await this.accountRepository.delete({ id: id });
    if (result.affected > 0) return true;
    return false;
  }
  async getAll(withDeleted: boolean): Promise<AccountEntity[]> {
    const accounts = await this.accountRepository.find({
      relations: [],
      withDeleted,
    });
    if (!accounts.length) {
      return null;
    }
    return accounts;
  }
  async getById(id: string, withDeleted = false): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne({
      where: { id },
      relations: ['userRoles'],
      withDeleted,
    });
    if (!account) {
      return null;
    }
    return account;
  }
  async getByPhoneNumber(
    phone: string,
    withDeleted = false,
  ): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne({
      where: { phone },
      relations: [],
      withDeleted,
    });
    if (!account) {
      return null;
    }
    return account;
  }
  async getByAccountId(
    accountId: string,
    withDeleted = false,
  ): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: [],
      withDeleted,
    });
    if (!account) {
      return null;
    }
    return account;
  }
  async archive(id: string): Promise<boolean> {
    const result = await this.accountRepository.softDelete(id);
    if (result.affected > 0) return true;
    return false;
  }
  async restore(id: string): Promise<boolean> {
    const result = await this.accountRepository.restore(id);
    if (result.affected > 0) return true;
    return false;
  }
}
