import { Status } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditProductDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  imageLink?: string;

  @IsOptional()
  status?: Status;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
