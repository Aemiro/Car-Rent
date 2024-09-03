import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCommand } from './usecases/users/user.usecase.command';
import { UserRepository } from './persistence/users/user.repository';
import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { UserQuery } from './usecases/users/user.usecase.query';
import { UserEntity } from './persistence/users/user.entity';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository, UserCommand, UserQuery],
})
export class UserModule {}
