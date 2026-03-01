'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/lib/api';
import { productSchema } from '@/validators/productSchema';
import { Category } from '@/types/product';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Spinner from '@/components/ui/Spinner';
import ImageUpload from '@/components/ui/ImageUpload';
import { z } from 'zod';

type ProductFormData = z.infer<typeof productSchema>;

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const isNew = params.id === 'new';
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data as Category[];
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/products/${params.id}`);
      return data.data;
    },
    enabled: !isNew,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        priceConsumer: product.priceConsumer,
        priceReseller: product.priceReseller,
        minOrderReseller: product.minOrderReseller,
        stock: product.stock,
        unit: product.unit,
        categoryId: product.categoryId,
      });
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description || '');
      payload.append('priceConsumer', String(formData.priceConsumer));
      payload.append('priceReseller', String(formData.priceReseller));
      payload.append('minOrderReseller', String(formData.minOrderReseller));
      payload.append('stock', String(formData.stock));
      payload.append('unit', formData.unit);
      if (formData.categoryId)
        payload.append('categoryId', formData.categoryId);
      if (imageFile) payload.append('image', imageFile);

      if (isNew) {
        return api.post('/admin/products', payload);
      }
      return api.put(`/admin/products/${params.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      router.push('/admin/products');
    },
  });

  if (!isNew && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-lora text-2xl font-semibold text-ink mb-6">
        {isNew ? 'Tambah Produk' : 'Edit Produk'}
      </h1>

      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data))}
        className="max-w-2xl space-y-5"
      >
        <div className="bg-white rounded-2xl border border-faint p-6 space-y-5">
          <Input
            label="Nama Produk"
            {...register('name')}
            error={errors.name?.message}
          />

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Deskripsi
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full rounded-xl border border-faint bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Kategori
            </label>
            <select
              {...register('categoryId')}
              className="w-full rounded-xl border border-faint bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3"
            >
              <option value="">Pilih kategori</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Harga Konsumer"
              type="number"
              {...register('priceConsumer', { valueAsNumber: true })}
              error={errors.priceConsumer?.message}
            />
            <Input
              label="Harga Reseller"
              type="number"
              {...register('priceReseller', { valueAsNumber: true })}
              error={errors.priceReseller?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min. Order Reseller"
              type="number"
              {...register('minOrderReseller', { valueAsNumber: true })}
              error={errors.minOrderReseller?.message}
            />
            <Input
              label="Stok"
              type="number"
              {...register('stock', { valueAsNumber: true })}
              error={errors.stock?.message}
            />
          </div>

          <Input
            label="Satuan"
            placeholder="kg, pcs, ikat..."
            {...register('unit')}
            error={errors.unit?.message}
          />

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Gambar Produk
            </label>
            <ImageUpload
              value={imagePreview || undefined}
              onChange={(file) => {
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file));
              }}
            />
            {imagePreview && (
              <div className="flex gap-2 mt-2 flex-wrap">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-sand relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending
              ? 'Menyimpan...'
              : isNew
                ? 'Tambah Produk'
                : 'Simpan Perubahan'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/admin/products')}
          >
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
