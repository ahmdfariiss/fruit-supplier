import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Nama produk minimal 2 karakter'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  categoryId: z.string().min(1, 'Kategori harus dipilih'),
  priceConsumer: z.number().min(0, 'Harga konsumen harus positif'),
  priceReseller: z.number().min(0, 'Harga reseller harus positif'),
  unit: z.string().min(1, 'Satuan harus diisi'),
  stock: z.number().int().min(0, 'Stok harus positif'),
  minOrderReseller: z.number().int().min(1, 'Minimum order minimal 1'),
  tags: z.array(z.string()).optional(),
  seasonStart: z.number().nullable().optional(),
  seasonEnd: z.number().nullable().optional(),
  isFeatured: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
