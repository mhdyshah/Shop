import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });
    delete user.hash;
    return { user };
  }

  async getUsers(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.isAdmin === true) {
      return this.prisma.user.findMany();
    }
    throw new ForbiddenException('access to resources denied!');
  }

  async getUser(userId: number, id: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.isAdmin === true) {
      const person = await this.prisma.user.findUnique({ where: { id } });
      if (!person) {
        throw new NotFoundException('user does not exist');
      }
      return { person };
    }
    throw new ForbiddenException('access to resources denied!');
  }
}
