import { DeepPartial } from 'typeorm';
import { CommonEntity } from '../common.entity';

export interface IBaseRepository<T extends CommonEntity> {
  getAll(relations: string[], withDeleted: boolean): Promise<T[]>;
  getById(id: string, relations: string[], withDeleted: boolean): Promise<T>;
  insert(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
  archive(id: string): Promise<boolean>;
  getOneBy(
    field: string,
    value: any,
    relations: string[],
    withDeleted: boolean,
  ): Promise<T>;
  getAllBy(
    field: string,
    value: any,
    relations: string[],
    withDeleted: boolean,
  ): Promise<T[]>;
  save(itemData: DeepPartial<T>): Promise<T>;
}
