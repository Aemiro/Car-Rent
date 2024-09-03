import * as jwt from 'jsonwebtoken';

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../usecases/accounts/auth.service';
import { AllowAnonymous } from 'modules/auth/decorators/allow-anonymous.decorator';
import { CurrentUser } from 'modules/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'modules/auth/guards/jwt-auth.guard';
import { UserInfo } from '@lib/common/user-info';
import { Util } from '@lib/common/util';
import {
  UserLoginCommand,
  ChangePasswordCommand,
} from '../usecases/accounts/auth.commands';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @AllowAnonymous()
  async login(@Body() loginCommand: UserLoginCommand) {
    return this.authService.login(loginCommand);
  }
  @Get('get-user-info')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@CurrentUser() user: UserInfo) {
    return user;
  }
  @Post('refresh')
  @AllowAnonymous()
  async getRefreshToken(@Headers() headers: object) {
    if (!headers['x-refresh-token']) {
      throw new ForbiddenException(`Refresh token required`);
    }
    try {
      const refreshToken = headers['x-refresh-token'];
      const p = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
      ) as UserInfo;
      return {
        accessToken: Util.GenerateToken(
          {
            id: p.id,
            email: p?.email,
            name: p?.name,
            gender: p?.gender,
            phone: p?.phone,
            tenantId: p?.tenantId,
          },
          '60m',
        ),
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: UserInfo,
    @Body() changePasswordCommand: ChangePasswordCommand,
  ) {
    changePasswordCommand.currentUser = user;
    return this.authService.changePassword(changePasswordCommand);
  }
}
