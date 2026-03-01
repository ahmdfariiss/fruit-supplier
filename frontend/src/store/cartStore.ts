import { create } from 'zustand';
import api from '@/lib/api';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  priceConsumer: number;
  priceReseller: number;
  minOrderReseller: number;
  stock: number;
  unit: string;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  buyerType: 'CONSUMER' | 'RESELLER';

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setBuyerType: (type: 'CONSUMER' | 'RESELLER') => void;

  // Computed
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  buyerType: 'CONSUMER',

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ items: data.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    await api.post('/cart', { productId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (itemId, quantity) => {
    await api.patch(`/cart/${itemId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/${itemId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [] });
  },

  setBuyerType: (type) => set({ buyerType: type }),

  totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  totalPrice: () => {
    const { items, buyerType } = get();
    return items.reduce((sum, item) => {
      const price =
        buyerType === 'RESELLER' &&
        item.quantity >= item.product.minOrderReseller
          ? Number(item.product.priceReseller)
          : Number(item.product.priceConsumer);
      return sum + price * item.quantity;
    }, 0);
  },
}));
