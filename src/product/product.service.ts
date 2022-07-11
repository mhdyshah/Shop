import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, EditProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async showProducts() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async showProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Not found!');
    }
    return { product };
  }

  async createProduct(dto: CreateProductDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Not found category!');
    }
    if (user.isAdmin === true) {
      try {
        const product = await this.prisma.product.create({
          data: {
            createdBy: user.fullName + ', id: ' + String(userId),
            ...dto,
            userId,
            categoryId: dto.categoryId,
          },
        });

        return { product, message: 'successfully created' };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credential taken');
          }
        }
      }
    } else {
      throw new ForbiddenException('access to resources denied!');
    }
  }

  async editProduct(productId: number, dto: EditProductDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.isAdmin === true) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Not found!');
      }
      return this.prisma.product.update({
        where: { id: productId },
        data: { updatedBy: user.fullName + ', id: ' + String(userId), ...dto },
      });
    } else {
      throw new ForbiddenException('access to resource denied!');
    }
  }

  async removeProduct(productId: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user.isAdmin === true) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Not found!');
      }
      await this.prisma.product.delete({ where: { id: productId } });
      console.log(
        `product with id: ${product.id} removed by Admin with id: ${user.id}`,
      );
      return 'successfully deleted';
    } else {
      throw new ForbiddenException('access to resource denied!');
    }
  }
}
