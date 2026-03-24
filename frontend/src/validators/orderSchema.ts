import { z } from 'zod';

export const orderSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DONE', 'CANCELLED']),
  paymentProof: z.instanceof(File).optional(),
  review: z.object({
    productId: z.string(),
    orderId: z.string(),
    rating: z.number().min(1).max(5),
    comment: z.string().max(500).optional(),
  }).optional(),
});

export type OrderSchema = z.infer<typeof orderSchema>;
