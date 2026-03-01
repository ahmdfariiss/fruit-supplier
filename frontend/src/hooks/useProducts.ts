'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from '@/types/product';
import type { PaginatedResponse } from '@/types/api';

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string;
  buyerType?: 'consumer' | 'reseller';
  featured?: boolean;
  seasonMonth?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
}

export const useProducts = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value));
        }
      });
      const { data } = await api.get<PaginatedResponse<Product>>(
        `/products?${params.toString()}`,
      );
      return data;
    },
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.data as Product;
    },
    enabled: !!slug,
  });
};
