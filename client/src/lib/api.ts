import { Product, ProductFormData, ProductsResponse } from '@/types/product';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  public originalMessage: string | string[];
  
  constructor(
    message: string | string[],
    public status: number,
    public data?: any
  ) {
    super(Array.isArray(message) ? message.join(', ') : message);
    this.name = 'ApiError';
    this.originalMessage = message;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || 'Произошла ошибка',
      response.status,
      error
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const api = {
  async getProducts(page: number = 1, limit: number = 50): Promise<ProductsResponse> {
    const response = await fetch(
      `${API_URL}/products?page=${page}&limit=${limit}`
    );
    return handleResponse<ProductsResponse>(response);
  },

  async createProduct(data: ProductFormData): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  async updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Product>(response);
  },

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

