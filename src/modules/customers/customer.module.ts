import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './persistence/tenants/tenant.entity';
import { ContractEntity } from './persistence/contracts/contract.entity';
import { TenantRepository } from './persistence/tenants/tenant.repository';
import { ContractRepository } from './persistence/contracts/contract.repository';
import { ContractCommand } from './usecases/contracts/contract.usecase.command';
import { ContractQuery } from './usecases/contracts/contract.usecase.query';
import { TenantCommand } from './usecases/tenants/tenant.usecase.command';
import { TenantQuery } from './usecases/tenants/tenant.usecase.query';
import { TenantController } from './controllers/tenant.controller';
import { ContractController } from './controllers/contract.controller';
import { AuthModule } from '@auth/auth.module';
import { StripeModule } from '@infrastructure/stripe/stripe.module';
import { AssetModule } from '@asset/asset.module';

@Module({
  controllers: [TenantController, ContractController],
  imports: [
    TypeOrmModule.forFeature([TenantEntity, ContractEntity]),
    AuthModule,
    StripeModule,
    AssetModule
  ],
  providers: [
    TenantRepository,
    TenantCommand,
    TenantQuery,
    ContractRepository,
    ContractCommand,
    ContractQuery,
  ],
})
export class CustomerModule {}
