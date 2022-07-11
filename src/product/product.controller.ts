import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateProductDto, EditProductDto } from './dto';
import { ProductService } from './product.service';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  showProducts(@Req() req: Request) {
    return this.productService.showProducts();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  showProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.productService.showProduct(productId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createProduct(@Body() dto: CreateProductDto, @GetUser('id') userId: number) {
    return this.productService.createProduct(dto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  editProduct(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: EditProductDto,
    @GetUser('id') userId: number,
  ) {
    return this.productService.editProduct(productId, dto, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  removeProduct(
    @Param('id', ParseIntPipe) productId: number,
    @GetUser('id') userId: number,
  ) {
    return this.productService.removeProduct(productId, userId);
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('photo', 10, {
      dest: './uploads',
    }),
  )
  upload(@UploadedFiles() files) {
    console.log(files);
    return { message: 'uploaded' };
  }
}
