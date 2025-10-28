import { z } from 'zod';

export const productSchema = z.object({
  article: z.string()
    .min(1, 'Артикул не может быть пустым')
    .trim(),
  
  name: z.string()
    .min(1, 'Название не может быть пустым')
    .trim(),
  
  price: z.coerce.number({
    required_error: 'Цена обязательна',
    invalid_type_error: 'Цена должна быть числом',
  })
    .positive('Цена должна быть больше 0')
    .min(0.01, 'Цена должна быть больше 0'),
  
  quantity: z.coerce.number({
    required_error: 'Количество обязательно',
    invalid_type_error: 'Количество должно быть числом',
  })
    .int('Количество должно быть целым числом')
    .min(0, 'Количество не может быть отрицательным'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

