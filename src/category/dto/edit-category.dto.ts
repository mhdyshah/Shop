import { IsOptional, IsString } from 'class-validator';

export class EditCategoryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
