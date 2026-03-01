import { z } from 'zod';

export const checkoutSchema = z.object({
  buyerType: z.enum(['CONSUMER', 'RESELLER'], {
    message: 'Tipe pembeli harus dipilih',
  }),
  shippingName: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  shippingPhone: z
    .string()
    .min(10, 'Nomor telepon minimal 10 digit')
    .regex(/^(\+62|62|0)[0-9]+$/, 'Format nomor telepon tidak valid'),
  shippingAddress: z.string().min(10, 'Alamat minimal 10 karakter'),
  notes: z.string().optional(),
  voucherCode: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
