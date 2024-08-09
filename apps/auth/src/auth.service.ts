import { Injectable } from '@nestjs/common';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response): Promise<void> {
    const now = new Date();
    now.setSeconds(now.getSeconds() + this.configService.get('JWT_EXPIRES_IN'));
    const expiresIn = now.getTime();

    const tokenPayload = {
      userId: user._id.toHexString(),
    };

    const token = this.jwtService.sign(tokenPayload, {
      expiresIn,
    });
    response.cookie('Authentication', token, {
      httpOnly: true,
    });
  }
}
