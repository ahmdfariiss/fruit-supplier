import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Nama produk minimal 2 karakter').max(200),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  categoryId: z.string().uuid('ID kategori tidak valid'),
  priceConsumer: z.number().positive('Harga konsumen harus positif'),
  priceReseller: z.number().positive('Harga reseller harus positif'),
  minOrderReseller: z.number().int().min(1).default(1),
  stock: z.number().int().min(0).default(0),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  isFeatured: z.boolean().default(false),
  seasonStart: z.number().int().min(1).max(12).nullable().optional(),
  seasonEnd: z.number().int().min(1).max(12).nullable().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
