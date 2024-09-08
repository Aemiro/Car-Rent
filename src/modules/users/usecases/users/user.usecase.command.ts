import { FileDto } from '@lib/common/file-dto';
import { UserRepository } from '../../persistence/users/user.repository';
import {
  ArchiveUserCommand,
  CreateUserCommand,
  UpdateUserCommand,
} from './user.commands';
import { UserResponse } from './user.response';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserInfo } from '@lib/common/user-info';
import { Util } from '@lib/common/util';
import { CreateAccountCommand } from '@auth/usecases/accounts/account.commands';
import {
  AddUserDocumentCommand,
  UpdateUserDocumentCommand,
  RemoveUserDocumentCommand,
} from './user-document.command';
import { AccountCommand } from '@auth/usecases/accounts/account.usecase.commands';
@Injectable()
export class UserCommand  {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountCommand: AccountCommand,
  ) {}
  async createUser(command: CreateUserCommand): Promise<UserResponse> {
    if (await this.userRepository.getOneBy('phone', command.phone, [], true)) {
      throw new BadRequestException(
        `User already exist with this phone number`,
      );
    }
    if (
      command.email &&
      (await this.userRepository.getOneBy('email', command.email, [], true))
    ) {
      throw new BadRequestException(
        `User already exist with this email Address`,
      );
    }
    const userDomain = CreateUserCommand.toEntity(command);
    userDomain.createdBy = command?.currentUser?.id;
    userDomain.updatedBy = command?.currentUser?.id;

    const user = await this.userRepository.insert(userDomain);
    if (user) {
      const password = command.password
        ? command.password
        : Util.generatePassword(8);
      const fullName = `${command.firstName} ${command.middleName}`;
      const createAccountCommand = new CreateAccountCommand();
      createAccountCommand.email = command.email;
      createAccountCommand.phone = command.phone;
      createAccountCommand.name = fullName;
      createAccountCommand.accountId = user.id;
      createAccountCommand.type = 'Employee';
      createAccountCommand.isActive = true;
      createAccountCommand.address = command.address;
      createAccountCommand.gender = command.gender;
      createAccountCommand.password = Util.hashPassword(password);
      // this.eventEmitter.emit('create.account', createAccountCommand);
      await this.accountCommand.createAccount(createAccountCommand);
      // if (account && account.email) {
      //   this.eventEmitter.emit('send.email.credential', {
      //     name: account.name,
      //     email: account.email,
      //     phoneNumber: account.phoneNumber,
      //     password: password,
      //   });
      // }
    }
    return UserResponse.toResponse(user);
  }
  async updateUser(command: UpdateUserCommand): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(command.id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${command.id}`);
    }
    if (userDomain.phone !== command.phone) {
      const user = await this.userRepository.getOneBy(
        'phone',
        command.phone,
        [],
        true,
      );
      if (user) {
        throw new BadRequestException(
          `User already exist with this phone number`,
        );
      }
    }
    if (
      command.email &&
      userDomain.email !== command.email &&
      (await this.userRepository.getOneBy('email', command.email, [], true))
    ) {
      throw new BadRequestException(
        `User already exist with this email Address`,
      );
    }
    userDomain.email = command.email;
    userDomain.firstName = command.firstName;
    userDomain.middleName = command.middleName;
    userDomain.lastName = command.lastName;
    userDomain.isActive = command.isActive;
    userDomain.phone = command.phone;
    userDomain.gender = command.gender;
    userDomain.jobTitle = command.jobTitle;
    userDomain.address = command.address;
    userDomain.updatedBy = command?.currentUser?.id;
    const user = await this.userRepository.save(userDomain);
    const fullName = `${command.firstName} ${command.middleName}`;

    if (user) {
      // this.eventEmitter.emit('update.account', {
      //   accountId: user.id,
      //   name: fullName,
      //   email: user.email,
      //   type: 'Employee',
      //   phone: user.phone,
      //   address: user.address,
      //   gender: user.gender,
      //   profilePicture: user.profilePicture,
      // });
      await this.accountCommand.updateAccount({
        accountId: user.id,
        name: fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        profilePicture: user.profilePicture,
        isActive: user.isActive,
      });
    }
    return UserResponse.toResponse(user);
  }
  async archiveUser(command: ArchiveUserCommand): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(command.id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${command.id}`);
    }
    userDomain.deletedAt = new Date();
    userDomain.deletedBy = command?.currentUser?.id;
    const result = await this.userRepository.save(userDomain);
    if (result) {
      // this.eventEmitter.emit('account.archived', {
      //   phone: userDomain.phone,
      //   id: userDomain.id,
      // });
      await this.accountCommand.handleArchiveAccount({
        phoneNumber: userDomain.phone,
        id: userDomain.id,
      });
    }

    return UserResponse.toResponse(result);
  }
  async restoreUser(id: string, currentUser: UserInfo): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    const r = await this.userRepository.restore(id);
    if (r) {
      userDomain.deletedAt = null;
      // this.eventEmitter.emit('account.restored', {
      //   phone: userDomain.phone,
      //   id: userDomain.id,
      // });
      await this.accountCommand.handleRestoreAccount({
        phoneNumber: userDomain.phone,
        id: userDomain.id,
      });
    }
    return UserResponse.toResponse(userDomain);
  }
  async deleteUser(id: string, currentUser: UserInfo): Promise<boolean> {
    const userDomain = await this.userRepository.getById(id, [], true);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    const result = await this.userRepository.delete(id);
    if (result) {
      if (userDomain.profilePicture) {
        Util.deleteFile(
          `${process.env.UPLOADED_FILES_DESTINATION}/${userDomain.profilePicture.name}`,
        );
      }
      // this.eventEmitter.emit('account.deleted', {
      //   phone: userDomain.phone,
      //   id: userDomain.id,
      // });
      await this.accountCommand.handleDeleteAccount({
        phoneNumber: userDomain.phone,
        id: userDomain.id,
      });
    }
    return result;
  }
  async activateOrBlockUser(
    id: string,
    currentUser: UserInfo,
  ): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(id);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${id}`);
    }
    userDomain.isActive = !userDomain.isActive;
    const result = await this.userRepository.save(userDomain);
    if (result) {
      // this.eventEmitter.emit('account.activate-or-block', {
      //   phone: userDomain.phone,
      //   id: userDomain.id,
      // });
      await this.accountCommand.activateOrBlockAccount({
        phoneNumber: userDomain.phone,
        id: userDomain.id,
      });
    }
    return UserResponse.toResponse(result);
  }
  async updateUserProfile(
    userId: string,
    currentUser: UserInfo,
    profileImage: FileDto,
  ): Promise<UserResponse> {
    const userDomain = await this.userRepository.getById(userId);
    if (!userDomain) {
      throw new NotFoundException(`User not found with id ${userId}`);
    }
    if (userDomain.profilePicture && profileImage) {
      Util.deleteFile(
        `${process.env.UPLOADED_FILES_DESTINATION}/${userDomain.profilePicture.name}`,
      );
    }
    userDomain.updatedBy = currentUser?.id;
    userDomain.profilePicture = profileImage;
    const result = await this.userRepository.save(userDomain);
    if (result) {
      // this.eventEmitter.emit('update-account-profile', {
      //   id: result.id,
      //   profilePicture: result.profilePicture,
      // });
      await this.accountCommand.updateAccountProfile({
        id: result.id,
        profilePicture: result.profilePicture,
      });
    }
    return UserResponse.toResponse(result);
  }
  // documents
  async addDocument(payload: AddUserDocumentCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['documents'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    const documentEntity = AddUserDocumentCommand.toEntity(payload);
    user.addDocument(documentEntity);
    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async updateDocument(payload: UpdateUserDocumentCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['documents'],
      true,
    );
    if (!user) throw new NotFoundException('User not found');
    let document = user.documents.find(
      (userDocument) => userDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    document = { ...document, ...payload };
    document.updatedBy = payload?.currentUser?.id;
    user.updateDocument(document);
    const updatedUser = await this.userRepository.save(user);
    return UserResponse.toResponse(updatedUser);
  }
  async removeDocument(payload: RemoveUserDocumentCommand) {
    const user = await this.userRepository.getById(
      payload.userId,
      ['documents'],
      true,
    );
    if (!user) throw new NotFoundException('Vehicle not found');
    const document = user.documents.find(
      (userDocument) => userDocument.id === payload.id,
    );
    if (!document) throw new NotFoundException('Document not found');
    user.removeDocument(document.id);
    const result = await this.userRepository.save(user);
    return UserResponse.toResponse(result);
  }
}
