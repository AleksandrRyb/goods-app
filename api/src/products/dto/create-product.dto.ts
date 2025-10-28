import { IsString, IsNumber, IsNotEmpty, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Артикул не может быть пустым' })
  @MinLength(1, { message: 'Артикул не может быть пустым' })
  article: string;

  @IsString()
  @IsNotEmpty({ message: 'Название не может быть пустым' })
  @MinLength(1, { message: 'Название не может быть пустым' })
  name: string;

  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0.01, { message: 'Цена должна быть больше 0' })
  price: number;

  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  quantity: number;
}

