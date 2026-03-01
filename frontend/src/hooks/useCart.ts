'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export const useCart = () => {
  const cart = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      cart.fetchCart();
    }
  }, [isAuthenticated]);

  return cart;
};
