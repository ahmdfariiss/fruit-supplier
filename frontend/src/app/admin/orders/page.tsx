'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatRupiah, formatDateTime } from '@/lib/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_FILTERS = [
  { value: '', label: 'Semua' },
  { value: 'PENDING', label: '⏳ Pending' },
  { value: 'CONFIRMED', label: '✅ Dikonfirmasi' },
  { value: 'PROCESSING', label: '🔄 Diproses' },
  { value: 'SHIPPED', label: '📦 Dikirim' },
  { value: 'DONE', label: '✨ Selesai' },
  { value: 'CANCELLED', label: '❌ Dibatalkan' },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, search, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      params.append('page', String(page));
      params.append('limit', '15');
      const { data } = await api.get(`/admin/orders?${params.toString()}`);
      return data;
    },
  });

  const orders: Order[] = data?.data || [];
  const pagination = data?.pagination;

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    } catch {
      alert('Gagal update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const NEXT_STATUS: Record<string, OrderStatus> = {
    PENDING: 'CONFIRMED',
    CONFIRMED: 'PROCESSING',
    PROCESSING: 'SHIPPED',
    SHIPPED: 'DONE',
  };

  const NEXT_LABEL: Record<string, string> = {
    PENDING: '✅ Konfirmasi',
    CONFIRMED: '🔄 Proses',
    PROCESSING: '🚚 Kirim',
    SHIPPED: '✨ Selesai',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-lora text-2xl font-semibold text-ink">Pesanan</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-faint p-4 mb-5 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="🔍 Cari no. pesanan / nama..."
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
        />
        <div className="flex gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => { setStatusFilter(f.value); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all
                ${statusFilter === f.value
                  ? 'bg-g1 text-white border-g1'
                  : 'bg-white text-muted border-faint hover:border-g3'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <span className="text-4xl block mb-3">📦</span>
            <p className="font-semibold">Tidak ada pesanan ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-g6 border-b border-faint">
                <tr>
                  {['No. Pesanan', 'Pelanggan', 'Tipe', 'Total', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-faint/60 hover:bg-g6/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-ink">{order.orderNumber}</span>
                      {order.paymentProofUrl && (
                        <span className="ml-1.5 text-[0.65rem] bg-[#fff3e0] text-[#c47d00] px-1.5 py-0.5 rounded-full font-bold">
                          Bukti Ada
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-ink">{order.user?.name || order.shippingName}</p>
                      <p className="text-xs text-muted">{order.user?.email}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        order.buyerType === 'RESELLER' ? 'bg-g5 text-g1' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {order.buyerType === 'RESELLER' ? 'Reseller' : 'Konsumen'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-g1">{formatRupiah(order.total)}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={ORDER_STATUS_COLORS[order.status] as 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange'}
                        size="sm"
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-muted text-xs">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="px-3 py-1.5 rounded-lg border border-faint text-xs font-bold text-muted hover:border-g3 hover:text-g1 transition-all"
                        >
                          Detail
                        </button>
                        {NEXT_STATUS[order.status] && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, NEXT_STATUS[order.status])}
                            disabled={updatingId === order.id}
                            className="px-3 py-1.5 rounded-lg bg-g1 text-white text-xs font-bold hover:bg-g2 transition-colors disabled:opacity-50"
                          >
                            {updatingId === order.id ? '...' : NEXT_LABEL[order.status]}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-faint">
            <span className="text-xs text-muted">
              {pagination.totalItems} pesanan
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-lg border border-faint text-sm font-bold disabled:opacity-40 hover:border-g3 transition-all"
              >‹</button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all
                    ${page === p ? 'bg-g1 text-white' : 'border border-faint hover:border-g3'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="w-8 h-8 rounded-lg border border-faint text-sm font-bold disabled:opacity-40 hover:border-g3 transition-all"
              >›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}