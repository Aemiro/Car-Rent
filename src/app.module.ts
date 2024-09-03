import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@user/persistence/users/user.entity';
import { UserModule } from '@user/user.module';
import { TenantEntity } from '@customer/persistence/tenants/tenant.entity';
import { TenantContactEntity } from '@customer/persistence/tenants/tenant-contact.entity';
import { PaymentEntity } from '@customer/persistence/payments/payment.entity';
import { CustomerModule } from '@customer/customer.module';
import { MulterModule } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import { RoleEntity } from '@auth/persistence/roles/role.entity';
import { UserRoleEntity } from '@auth/persistence/accounts/user-role.entity';
import { AccountEntity } from '@auth/persistence/accounts/account.entity';
import { AuthModule } from '@auth/auth.module';
import { SettingModule } from '@setting/setting.module';
import { ContractEntity } from '@customer/persistence/contracts/contract.entity';
import { VehicleTypeEntity } from '@asset/persistence/vehicle-types/vehicle.type.entity';
import { VehicleEntity } from '@asset/persistence/vehicles/vehicle.entity';
import { AssetModule } from '@asset/asset.module';
import { DocumentTypeEntity } from '@setting/persistence/document-types/document.type.entity';
import { VehicleDocumentEntity } from '@asset/persistence/vehicles/vehicle-document.entity';
import { UserDocumentEntity } from '@user/persistence/users/user-document.entity';
import { ContractDocumentEntity } from '@customer/persistence/contracts/contract-document.entity';
import { PaymentDocumentEntity } from '@customer/persistence/payments/payment-document.entity';
import { MaintenanceEntity } from '@asset/persistence/maintenances/maintenance.entity';
import { PreventiveMaintenancePlanEntity } from '@asset/persistence/preventive-maintenance-plans/preventive-maintenance-plan.entity';
import { MaintenanceAlertEntity } from '@asset/persistence/maintenance-alerts/maintenance-alert.entity';
import { MaintenanceDocumentEntity } from '@asset/persistence/maintenances/maintenance-document.entity';
import { TenantDocumentEntity } from '@customer/persistence/tenants/tenant-document.entity';
import { NotificationModule } from '@notification/notification.module';
import { NotificationEntity } from '@notification/persistence/notifications/notification.entity';
import { RevenueSourceEntity } from '@finance/persistence/revenue-sources/revenue-source.entity';
import { ExpenseTypeEntity } from '@finance/persistence/expense-types/expense-type.entity';
import { FinanceModule } from '@finance/finance.module';
import { RevenueEntity } from '@finance/persistence/revenues/revenue.entity';
import { ExpenseEntity } from '@finance/persistence/expenses/expense.entity';
dotenv.config({ path: '.env' });
@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    MulterModule.register({
      dest: process.env.UPLOADED_FILES_DESTINATION,
    }),
    TypeOrmModule.forRoot({
      // url: process.env.DB_URL,
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      schema: process.env.DATABASE_SCHEMA,
      port: parseInt(process.env.DATABASE_PORT),
      // ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,

          // ca: fs.readFileSync('ca.pem').toString(),
          ca: process.env.DBSSL_CERT,
        },
      },
      entities: [
        UserEntity,
        RoleEntity,
        AccountEntity,
        UserRoleEntity,
        TenantEntity,
        TenantContactEntity,
        PaymentEntity,
        ContractEntity,
        VehicleTypeEntity,
        VehicleEntity,
        DocumentTypeEntity,
        VehicleDocumentEntity,
        UserDocumentEntity,
        ContractDocumentEntity,
        PaymentDocumentEntity,
        MaintenanceEntity,
        PreventiveMaintenancePlanEntity,
        MaintenanceAlertEntity,
        MaintenanceDocumentEntity,
        TenantDocumentEntity,
        PaymentDocumentEntity,
        NotificationEntity,
        RevenueSourceEntity,
        ExpenseTypeEntity,
        RevenueEntity,
        ExpenseEntity,
      ],
      // synchronize: process.env.NODE_ENV === 'production' ? false : true,
      logging: process.env.NODE_ENV === 'production' ? false : true,
    }),
    UserModule,
    CustomerModule,
    AuthModule,
    SettingModule,
    AssetModule,
    NotificationModule,
    FinanceModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
