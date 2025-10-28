import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Артикул не может быть пустым' })
  article?: string;

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Название не может быть пустым' })
  name?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0.01, { message: 'Цена должна быть больше 0' })
  price?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  quantity?: number;
}

