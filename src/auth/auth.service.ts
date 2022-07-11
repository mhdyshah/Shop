import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    // bellow code can sent to user's mobile phone
    const authCode = await Math.floor(Math.random() * 100000);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
          phone: dto.phone,
          fullName: dto.fullName,
          address: dto.address,
          authCode,
          isAdmin: false,
          role: 'USER',
        },
        select: {
          id: true,
          email: true,
          phone: true,
          fullName: true,
          address: true,
          createdAt: true,
        },
      });
      return { user };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential taken');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    const phone = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });
    if (user && phone) {
      user.isAdmin === false;
    }
    if (!user || !phone) {
      throw new ForbiddenException('Credential incorrect');
    }
    const matchPwd = await argon.verify(user.hash, dto.password);
    if (!matchPwd) {
      throw new ForbiddenException('Credential incorrect');
    }
    return this.signToken(user.id, user.email, user.role);
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
  ): Promise<{ access_token: string }> {
    const payload = { sub: userId, email, role };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secret,
    });
    return { access_token: token };
  }

  async logout(userId: number, dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const matchPwd = await argon.verify(user.hash, dto.password);
    if (!matchPwd) {
      throw new ForbiddenException('Credentials incorrect');
    }
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2014' || error.code === 'P2003') {
          console.log(error.message);
        }
      }
      return { message: 'Your account successfully deleted' };
    }
  }
}
