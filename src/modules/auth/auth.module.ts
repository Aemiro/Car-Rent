import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from '../auth/usecases/accounts/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RoleEntity } from './persistence/roles/role.entity';
import { RoleController } from './controllers/role.controller';
import { RoleRepository } from './persistence/roles/role.repository';
import { RoleCommand } from './usecases/roles/role.usecase.command';
import { RoleQuery } from './usecases/roles/role.usecase.query';
import { AccountEntity } from './persistence/accounts/account.entity';
import { AccountRepository } from './persistence/accounts/account.repository';
import { AccountController } from './controllers/account.controller';
import { AccountCommand } from './usecases/accounts/account.usecase.commands';
import { AccountQuery } from './usecases/accounts/account.usecase.queries';
import { UserRoleEntity } from './persistence/accounts/user-role.entity';

@Module({
  controllers: [AccountController, AuthController, RoleController],
  imports: [
    TypeOrmModule.forFeature([AccountEntity, RoleEntity, UserRoleEntity]),
    PassportModule,
  ],
  providers: [
    AccountRepository,
    AccountCommand,
    AccountQuery,
    RoleRepository,
    RoleCommand,
    RoleQuery,
    AuthService,
    JwtStrategy,
  ],
  exports: [AccountCommand],
})
export class AuthModule {}
