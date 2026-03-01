'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/formatters';
import { Product } from '@/types/product';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/products', {
        params: { page, limit: 10 },
      });
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setDeleteTarget(null);
    },
  });

  const products: Product[] = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Manajemen Produk
        </h1>
        <Link href="/admin/products/new">
          <Button>+ Tambah Produk</Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-faint bg-sand/30">
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Produk
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Kategori
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Harga Konsumen
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Stok
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-faint/50 hover:bg-sand/10"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-sand relative flex-shrink-0">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <span className="font-semibold text-ink">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted">
                    {product.category?.name || '-'}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {formatRupiah(product.priceConsumer)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-g2'}`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(product)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-muted">Belum ada produk</div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Produk"
      >
        <p className="text-sm text-muted mb-4">
          Apakah Anda yakin ingin menghapus produk{' '}
          <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat
          dibatalkan.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button
            onClick={() =>
              deleteTarget && deleteMutation.mutate(deleteTarget.id)
            }
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
