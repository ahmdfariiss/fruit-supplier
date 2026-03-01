import { z } from 'zod';

export const createOrderSchema = z.object({
  buyerType: z.enum(['CONSUMER', 'RESELLER']),
  shippingName: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  shippingPhone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  shippingAddress: z.string().min(10, 'Alamat minimal 10 karakter'),
  notes: z.string().optional(),
  voucherCode: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DONE',
    'CANCELLED',
  ]),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
