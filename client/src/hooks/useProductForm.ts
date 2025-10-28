import { useState, useEffect } from 'react';
import { Product, ProductFormData } from '@/types/product';
import { productSchema } from '@/lib/validations';
import { ApiError } from '@/lib/api';

interface FormErrors {
  article?: string;
  name?: string;
  price?: string;
  quantity?: string;
}

interface UseProductFormProps {
  product?: Product;
  open: boolean;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export function useProductForm({ product, open, onSubmit, onClose }: UseProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    article: '',
    name: '',
    price: 1,
    quantity: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        article: product.article,
        name: product.name,
        price: Number(product.price),
        quantity: Number(product.quantity),
      });
    } else {
      setFormData({
        article: '',
        name: '',
        price: 1,
        quantity: 0,
      });
    }
    setErrors({});
  }, [product, open]);

  const validateForm = (): boolean => {
    const result = productSchema.safeParse(formData);
    
    if (result.success) {
      setErrors({});
      return true;
    }
    
    const newErrors: FormErrors = {};
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof FormErrors;
      if (!newErrors[field]) {
        newErrors[field] = err.message;
      }
    });
    setErrors(newErrors);
    return false;
  };

  const validateField = (field: keyof ProductFormData) => {
    const fieldSchema = productSchema.shape[field];
    const result = fieldSchema.safeParse(formData[field]);
    
    if (result.success) {
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    } else {
      setErrors((prev) => ({ 
        ...prev, 
        [field]: result.error.errors[0]?.message 
      }));
    }
  };

  const parseApiErrors = (error: ApiError): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (error.data?.message && Array.isArray(error.data.message)) {
      error.data.message.forEach((msg: string) => {
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes('article') || lowerMsg.includes('артикул')) {
          newErrors.article = msg;
        } else if (lowerMsg.includes('name') || lowerMsg.includes('название')) {
          newErrors.name = msg;
        } else if (lowerMsg.includes('price') || lowerMsg.includes('цен')) {
          newErrors.price = msg;
        } else if (lowerMsg.includes('quantity') || lowerMsg.includes('количество')) {
          newErrors.quantity = msg;
        }
      });
    } else if (error.message) {
      const lowerMsg = error.message.toLowerCase();
      
      if (lowerMsg.includes('артикул') && lowerMsg.includes('существует')) {
        newErrors.article = error.message;
      } else {
        newErrors.article = error.message;
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      if (error instanceof ApiError) {
        const apiErrors = parseApiErrors(error);
        setErrors(apiErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof ProductFormData) => {
    validateField(field);
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleSubmit,
    handleChange,
    handleBlur,
  };
}

