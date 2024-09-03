import { CommonEntity } from '@lib/common/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserRoleEntity } from '../accounts/user-role.entity';
@Entity('roles')
export class RoleEntity extends CommonEntity {
  @Column({ name: 'name' })
  name: string;
  @Column()
  key: string;
  @Column({ name: 'description', nullable: true, type: 'text' })
  description: string;
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userRoles: UserRoleEntity[];
}
