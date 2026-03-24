'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export const useCart = () => {
  const cart = useCartStore();
  const fetchCart = useCartStore((s) => s.fetchCart);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  return cart;
};
