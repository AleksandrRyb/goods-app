import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { api, ApiError } from '@/lib/api';
import { ProductTable } from '@/components/ProductTable';
import { ProductForm } from '@/components/ProductForm';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();

  const limit = 50;
  const totalPages = Math.ceil(total / limit);

  const loadProducts = async (page: number = currentPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getProducts(page, limit);
      setProducts(response.data);
      setTotal(response.total);
    } catch (err) {
      setError('Не удалось загрузить товары');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await api.deleteProduct(id);
      await loadProducts(currentPage);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Ошибка: ${err.message}`);
      }
    }
  };

  const handleSubmitForm = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
      } else {
        await api.createProduct(data);
      }
      await loadProducts(currentPage);
      setIsFormOpen(false);
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new Error('Произошла ошибка при сохранении товара');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Управление товарами</h1>
          <p className="text-muted-foreground">
            Простая система учета товаров на складе
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            Всего товаров: {total}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => loadProducts()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={handleAddProduct}>
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <ProductTable
          products={products}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <ProductForm
          product={editingProduct}
          open={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmitForm}
        />
      </div>
    </div>
  );
}

export default App;

