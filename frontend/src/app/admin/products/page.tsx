'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/formatters';
import Spinner from '@/components/ui/Spinner';
import Image from 'next/image';
import type { Product } from '@/types/product';

export default function AdminProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', String(page));
      params.append('limit', '12');
      const { data } = await api.get(`/admin/products?${params.toString()}`);
      return data;
    },
  });

  const products: Product[] = data?.data || [];
  const pagination = data?.pagination;

  const handleToggleFeatured = async (product: Product) => {
    setTogglingId(product.id);
    try {
      await api.patch(`/admin/products/${product.id}`, { isFeatured: !product.isFeatured });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch {
      alert('Gagal mengubah status unggulan');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Hapus produk "${product.name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingId(product.id);
    try {
      await api.delete(`/admin/products/${product.id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    } catch {
      alert('Gagal menghapus produk');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-lora text-2xl font-semibold text-ink">Produk</h1>
        <button
          onClick={() => router.push('/admin/products/new')}
          className="px-5 py-2.5 bg-g1 text-white rounded-xl text-sm font-bold hover:bg-g2 transition-colors flex items-center gap-2"
        >
          + Tambah Produk
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-faint p-4 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="🔍 Cari nama produk..."
          className="w-full px-4 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <span className="text-4xl block mb-3">🍎</span>
            <p className="font-semibold">Tidak ada produk ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-g6 border-b border-faint">
                <tr>
                  {['Produk', 'Kategori', 'Harga Konsumen', 'Harga Reseller', 'Stok', 'Unggulan', 'Aksi'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-faint/60 hover:bg-g6/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-g6 overflow-hidden flex-shrink-0 relative">
                          {product.imageUrl
                            ? <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                            : <div className="absolute inset-0 flex items-center justify-center text-xl">🍊</div>
                          }
                        </div>
                        <div>
                          <p className="font-bold text-ink">{product.name}</p>
                          <p className="text-xs text-muted">/{product.unit}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs bg-g5 text-g1 px-2 py-1 rounded-full font-bold">
                        {product.category?.icon} {product.category?.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold">{formatRupiah(product.priceConsumer)}</td>
                    <td className="py-3.5 px-4 font-semibold text-g1">{formatRupiah(product.priceReseller)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        product.stock > 10 ? 'bg-g5 text-g1' : product.stock > 0 ? 'bg-[#fff3e0] text-[#c47d00]' : 'bg-red/10 text-red'
                      }`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(product)}
                        disabled={togglingId === product.id}
                        className={`w-10 h-6 rounded-full transition-all relative ${
                          product.isFeatured ? 'bg-g1' : 'bg-faint'
                        } disabled:opacity-50`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                          product.isFeatured ? 'left-5' : 'left-1'
                        }`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}`)}
                          className="px-3 py-1.5 rounded-lg border border-faint text-xs font-bold text-muted hover:border-g3 hover:text-g1 transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="px-3 py-1.5 rounded-lg bg-red/10 text-red text-xs font-bold hover:bg-red/20 transition-all disabled:opacity-50"
                        >
                          {deletingId === product.id ? '...' : 'Hapus'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-faint">
            <span className="text-xs text-muted">{pagination.totalItems} produk</span>
            <div className="flex gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="w-8 h-8 rounded-lg border border-faint text-sm font-bold disabled:opacity-40 hover:border-g3">‹</button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === p ? 'bg-g1 text-white' : 'border border-faint hover:border-g3'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                className="w-8 h-8 rounded-lg border border-faint text-sm font-bold disabled:opacity-40 hover:border-g3">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}