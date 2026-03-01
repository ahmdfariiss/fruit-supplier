import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    phone: z
      .string()
      .min(10, 'Nomor telepon minimal 10 digit')
      .regex(/^(\+62|62|0)[0-9]+$/, 'Format nomor telepon tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Z]/, 'Password harus memiliki huruf besar')
      .regex(/[0-9]/, 'Password harus memiliki angka'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak sama',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
