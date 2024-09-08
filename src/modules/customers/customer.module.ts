import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './persistence/tenants/tenant.entity';
import { ContractEntity } from './persistence/contracts/contract.entity';
import { PaymentEntity } from './persistence/payments/payment.entity';
import { TenantRepository } from './persistence/tenants/tenant.repository';
import { ContractRepository } from './persistence/contracts/contract.repository';
import { PaymentRepository } from './persistence/payments/payment.repository';
import { ContractCommand } from './usecases/contracts/contract.usecase.command';
import { ContractQuery } from './usecases/contracts/contract.usecase.query';
import { PaymentCommand } from './usecases/payments/payment.usecase.command';
import { PaymentQuery } from './usecases/payments/payment.usecase.query';
import { TenantCommand } from './usecases/tenants/tenant.usecase.command';
import { TenantQuery } from './usecases/tenants/tenant.usecase.query';
import { TenantController } from './controllers/tenant.controller';
import { PaymentController } from './controllers/payment.controller';
import { ContractController } from './controllers/contract.controller';
import { AuthModule } from '@auth/auth.module';

@Module({
  controllers: [TenantController, PaymentController, ContractController],
  imports: [
    TypeOrmModule.forFeature([TenantEntity, PaymentEntity, ContractEntity]),
    AuthModule,
  ],
  providers: [
    TenantRepository,
    TenantCommand,
    TenantQuery,
    ContractRepository,
    ContractCommand,
    ContractQuery,
    PaymentRepository,
    PaymentCommand,
    PaymentQuery,
  ],
})
export class CustomerModule {}
