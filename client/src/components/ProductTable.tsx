import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              ID
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Название
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Артикул
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Цена
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Количество
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-24 text-center text-muted-foreground">
                Нет товаров
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="border-t transition-colors hover:bg-muted/50"
              >
                <td className="p-4 align-middle">{product.id}</td>
                <td className="p-4 align-middle">{product.name}</td>
                <td className="p-4 align-middle">{product.article}</td>
                <td className="p-4 align-middle">{product.price}</td>
                <td className="p-4 align-middle">{product.quantity}</td>
                <td className="p-4 align-middle">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      title="Редактировать"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product.id)}
                      title="Удалить"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

