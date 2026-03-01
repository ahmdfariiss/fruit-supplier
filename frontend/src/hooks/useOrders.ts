'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Order } from '@/types/order';
import type { PaginatedResponse } from '@/types/api';

export const useOrders = (status?: string, page = 1) => {
  return useQuery({
    queryKey: ['orders', status, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', String(page));
      const { data } = await api.get<PaginatedResponse<Order>>(
        `/orders?${params.toString()}`,
      );
      return data;
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data.data as Order;
    },
    enabled: !!id,
  });
};
