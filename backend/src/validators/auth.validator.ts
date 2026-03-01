import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
    email: z.string().email('Format email tidak valid'),
    phone: z
      .string()
      .min(10, 'Nomor telepon minimal 10 digit')
      .regex(/^(\+62|62|0)[0-9]+$/, 'Format nomor telepon tidak valid')
      .optional(),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
