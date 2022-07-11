import { Status } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  imageLink: string;

  @IsNotEmpty()
  status: Status;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
