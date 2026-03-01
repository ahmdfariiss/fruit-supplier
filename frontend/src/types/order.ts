export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  buyerType: 'CONSUMER' | 'RESELLER';
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  voucherCode: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes: string | null;
  paymentProofUrl: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  product?: {
    name: string;
    slug: string;
    imageUrl: string | null;
  };
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DONE'
  | 'CANCELLED';
