import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthLocalGuard } from './guards/local-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, UserDto, UserDocument } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthLocalGuard)
  async login(@CurrentUser() user: UserDocument, @Res({ passthrough: true }) response: Response): Promise<void> {
    await this.authService.login(user, response);
    response.send(user);
  }

  @MessagePattern('authenticate')
  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: any): Promise<UserDto> {
    return data.user;
  }
}
