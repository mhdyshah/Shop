import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, EditCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories() {
    const categories = await this.prisma.category.findMany();
    return categories;
  }

  async getCategory(categoryId: number) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Not Found!');
    }
    return { category };
  }

  async createCategory(dto: CreateCategoryDto, userId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (user.isAdmin === true) {
      const category = await this.prisma.category.create({
        data: {
          createdBy: user.fullName + ', id: ' + String(userId),
          title: dto.title,
          userId,
        },
        select: {
          id: true,
          title: true,
        },
      });
      return { category, message: 'successfully created' };
    } else {
      throw new ForbiddenException('access to resource denied!');
    }
  }

  async editCategory(categoryId: number, dto: EditCategoryDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.isAdmin === true) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('category not found!');
      }
      return this.prisma.category.updateMany({
        where: { id: categoryId },
        data: {
          updatedBy: user.fullName + ', id: ' + String(userId),
          ...dto,
        },
      });
    } else {
      throw new ForbiddenException('access to resource denied!');
    }
  }

  async removeCategory(categoryId: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.isAdmin === true) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('category not found!');
      }
      await this.prisma.category.delete({ where: { id: categoryId } });
      console.log(
        `category with id: ${category.id} removed by Admin with id: ${userId}`,
      );
      return 'successfully deleted';
    } else {
      throw new ForbiddenException('access to resource denied!');
    }
  }
}
