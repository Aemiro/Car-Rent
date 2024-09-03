import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from '../roles/role.entity';
import { AccountEntity } from './account.entity';
@Entity('user_roles')
export class UserRoleEntity extends CommonEntity {
  @Column({ name: 'user_id' })
  userId: string;
  @Column({ name: 'role_id' })
  roleId: string;
  @ManyToOne(() => AccountEntity, (user) => user.userRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: AccountEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
