import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ChangePasswordCommand,
  UpdatePasswordCommand,
  UserLoginCommand,
} from 'modules/auth/usecases/accounts/auth.commands';
import { Util } from '@lib/common/util';
import { UserInfo } from '@lib/common/user-info';
import { AccountEntity } from '../../persistence/accounts/account.entity';
import { AccountResponse } from './account.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly userRepository: Repository<AccountEntity>,
  ) {}
  async login(loginCommand: UserLoginCommand) {
    const account = await this.userRepository.findOne({
      where: { email: loginCommand.email },
      relations: ['userRoles', 'userRoles.role'],
    });
    if (!account) {
      throw new BadRequestException(`Incorrect email or password`);
    }

    if (!Util.comparePassword(loginCommand.password, account.password)) {
      throw new BadRequestException(`Incorrect email or password`);
    }
    if (account.isActive === false || !account.isActive) {
      throw new BadRequestException(
        `You have been blocked, please contact us.`,
      );
    }
    const roles = [];
    const userRoles = account.userRoles;
    if (userRoles) {
      for (const userRole of userRoles) {
        roles.push(userRole.role.key);
      }
    }
    const payload: UserInfo = {
      id: account.id,
      // isPowerUser: account.isPowerUser ?? false,
      email: account?.email,
      name: account?.name,
      gender: account?.gender,
      phone: account?.phone,
      type: account?.type,
      tenantId: account.type.toLowerCase() === 'tenant' ? account?.id : null,
      roles,
    };
    const now = new Date();
    const accessToken = Util.GenerateToken(payload, '1d');
    const refreshToken = Util.GenerateRefreshToken(payload);
    const res = {
      accessToken,
      refreshToken,
      accessExpiresIn: new Date(now.getTime() + 2 * 60 * 1000),
      refreshExpiresIn: new Date(now.getTime() + 3 * 60 * 1000),
      profile: AccountResponse.toResponse(account),
    };
    return res;
  }
  async changePassword(changePasswordCommand: ChangePasswordCommand) {
    const currentUser = changePasswordCommand.currentUser;
    const user = await this.userRepository.findOneBy({
      id: currentUser.id,
    });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    if (
      !Util.comparePassword(
        changePasswordCommand.currentPassword,
        user.password,
      )
    ) {
      throw new BadRequestException(`Incorrect old password`);
    }
    user.password = await Util.hashPassword(changePasswordCommand.password);
    const result = await this.userRepository.update(user.id, user);
    return result ? true : false;
  }
  async updatePassword(updatePasswordCommand: UpdatePasswordCommand) {
    const user = await this.userRepository.findOneBy({
      email: updatePasswordCommand.email,
    });
    if (!user) {
      throw new NotFoundException(`User account not found with this email`);
    }
    user.password = await Util.hashPassword(updatePasswordCommand.password);
    const result = await this.userRepository.update(user.id, user);
    return result ? true : false;
  }
}
