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
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './dto';

@UseGuards(JwtGuard)
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  getCategories(@Req() req: Request) {
    return this.categoryService.getCategories();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) categoryId: number) {
    return this.categoryService.getCategory(categoryId);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  createCategory(
    @Body() dto: CreateCategoryDto,
    @GetUser('id') userId: number,
  ) {
    return this.categoryService.createCategory(dto, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('edit/:id')
  editCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @Body() dto: EditCategoryDto,
    @GetUser('id') userId: number,
  ) {
    return this.categoryService.editCategory(categoryId, dto, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('delete/:id')
  removeCategory(
    @Param('id', ParseIntPipe) categoryId: number,
    @GetUser('id') userId: number,
  ) {
    return this.categoryService.removeCategory(categoryId, userId);
  }
}
