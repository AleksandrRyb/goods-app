import { Product, ProductFormData } from '@/types/product';
import { useProductForm } from '@/hooks/useProductForm';
import { FormField } from '@/components/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ProductFormProps {
  product?: Product;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

export function ProductForm({ product, open, onClose, onSubmit }: ProductFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
  } = useProductForm({ product, open, onSubmit, onClose });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <FormField
              id="name"
              label="Название"
              value={formData.name}
              error={errors.name}
              onChange={(value) => handleChange('name', value)}
              onBlur={() => handleBlur('name')}
            />

            <FormField
              id="article"
              label="Артикул"
              value={formData.article}
              error={errors.article}
              onChange={(value) => handleChange('article', value)}
              onBlur={() => handleBlur('article')}
            />

            <FormField
              id="price"
              label="Цена"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              error={errors.price}
              onChange={(value) => handleChange('price', value)}
              onBlur={() => handleBlur('price')}
            />

            <FormField
              id="quantity"
              label="Количество"
              type="number"
              min="0"
              value={formData.quantity}
              error={errors.quantity}
              onChange={(value) => handleChange('quantity', value)}
              onBlur={() => handleBlur('quantity')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
