import { AccountEntity } from './account.entity';
export interface IAccountRepository {
  insert(account: AccountEntity): Promise<AccountEntity>;
  update(account: AccountEntity): Promise<AccountEntity>;
  delete(id: string): Promise<boolean>;
  getAll(withDeleted: boolean): Promise<AccountEntity[]>;
  getById(id: string, withDeleted: boolean): Promise<AccountEntity>;
  getByPhoneNumber(
    phoneNumber: string,
    withDeleted: boolean,
  ): Promise<AccountEntity>;
  getByAccountId(
    accountId: string,
    withDeleted: boolean,
  ): Promise<AccountEntity>;
  archive(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
}
