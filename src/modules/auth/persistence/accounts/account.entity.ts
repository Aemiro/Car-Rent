import { Address } from '@lib/common/address';
import { CommonEntity } from '@lib/common/common.entity';
import { FileDto } from '@lib/common/file-dto';
import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity('accounts')
export class AccountEntity extends CommonEntity {
  @PrimaryColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Index()
  @Column({ name: 'phone' })
  phone: string;
  @Column({ nullable: true })
  email: string;
  @Column()
  type: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ name: 'is_active' })
  isActive: boolean;
  @Column()
  password: string;
  @Column({ nullable: true, name: 'fcm_id' })
  fcmId: string;
  @Column({ name: 'address', type: 'jsonb', nullable: true })
  address: Address;
  @Column({ name: 'profile_image', type: 'jsonb', nullable: true })
  profilePicture: FileDto;
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userRoles: UserRoleEntity[];

  addUserRole(userRole: UserRoleEntity) {
    this.userRoles.push(userRole);
  }
  updateUserRole(userRole: UserRoleEntity) {
    const existIndex = this.userRoles.findIndex(
      (element) => element.id === userRole.id,
    );
    this.userRoles[existIndex] = userRole;
  }
  removeUserRole(id: string) {
    this.userRoles = this.userRoles.filter((element) => element.id !== id);
  }
  updateUserRoles(userRoles: UserRoleEntity[]) {
    this.userRoles = userRoles;
  }
}
