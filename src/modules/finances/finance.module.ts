import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevenueSourceController } from './controllers/revenue-source.controller';
import { RevenueSourceEntity } from './persistence/revenue-sources/revenue-source.entity';
import { RevenueSourceCommand } from './usecases/revenue-sources/revenue-source.usecase.command';
import { RevenueSourceRepository } from './persistence/revenue-sources/revenue-source.repository';
import { RevenueSourceQuery } from './usecases/revenue-sources/revenue-source.usecase.query';
import { ExpenseTypeEntity } from './persistence/expense-types/expense-type.entity';
import { ExpenseTypeController } from './controllers/expense-type.controller';
import { ExpenseTypeRepository } from './persistence/expense-types/expense-type.repository';
import { ExpenseTypeCommand } from './usecases/expense-types/expense-type.usecase.command';
import { ExpenseTypeQuery } from './usecases/expense-types/expense-type.usecase.query';
import { ExpenseController } from './controllers/expense.controller';
import { RevenueController } from './controllers/revenue.controller';
import { ExpenseEntity } from './persistence/expenses/expense.entity';
import { ExpenseRepository } from './persistence/expenses/expense.repository';
import { RevenueEntity } from './persistence/revenues/revenue.entity';
import { RevenueRepository } from './persistence/revenues/revenue.repository';
import { ExpenseCommand } from './usecases/expenses/expense.usecase.command';
import { ExpenseQuery } from './usecases/expenses/expense.usecase.query';
import { RevenueCommand } from './usecases/revenues/revenue.usecase.command';
import { RevenueQuery } from './usecases/revenues/revenue.usecase.query';
import { StripeService } from './usecases/stripes/stripe.service';
import { PaymentController } from '@finance/controllers/payment.controller';
import { PaymentEntity } from './persistence/payments/payment.entity';
import { PaymentRepository } from './persistence/payments/payment.repository';
import { PaymentCommand } from './usecases/payments/payment.usecase.command';
import { PaymentQuery } from './usecases/payments/payment.usecase.query';
@Module({
  controllers: [
    RevenueSourceController,
    ExpenseTypeController,
    RevenueController,
    ExpenseController,
    PaymentController,
  ],
  imports: [
    TypeOrmModule.forFeature([
      RevenueSourceEntity,
      ExpenseTypeEntity,
      RevenueEntity,
      ExpenseEntity,
      PaymentEntity,
    ]),
  ],
  providers: [
    RevenueSourceRepository,
    RevenueSourceCommand,
    RevenueSourceQuery,
    ExpenseTypeRepository,
    ExpenseTypeCommand,
    ExpenseTypeQuery,

    RevenueRepository,
    RevenueCommand,
    RevenueQuery,
    ExpenseRepository,
    ExpenseCommand,
    ExpenseQuery,
    StripeService,
    PaymentRepository,
    PaymentCommand,
    PaymentQuery,
  ],
})
export class FinanceModule {}
