'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { formatRupiah, formatDateTime } from '@/lib/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { OrderStatus } from '@/types/order';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (statusFilter !== 'ALL') params.status = statusFilter;
      const { data } = await api.get('/admin/orders', { params });
      return data;
    },
  });

  const statusTabs: { label: string; value: string }[] = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Menunggu', value: 'PENDING' },
    { label: 'Dikonfirmasi', value: 'CONFIRMED' },
    { label: 'Diproses', value: 'PROCESSING' },
    { label: 'Dikirim', value: 'SHIPPED' },
    { label: 'Selesai', value: 'DONE' },
    { label: 'Dibatalkan', value: 'CANCELLED' },
  ];

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  const orders = data?.data || [];
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
      <h1 className="font-lora text-2xl font-semibold text-ink mb-6">
        Manajemen Pesanan
      </h1>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              statusFilter === tab.value
                ? 'bg-g2 text-white'
                : 'bg-sand text-muted hover:bg-faint'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-faint bg-sand/30">
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  No. Pesanan
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Pelanggan
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Tanggal
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map(
                (order: {
                  id: string;
                  orderNumber: string;
                  total: number;
                  status: OrderStatus;
                  createdAt: string;
                  user: { name: string };
                }) => (
                  <tr
                    key={order.id}
                    className="border-b border-faint/50 hover:bg-sand/10"
                  >
                    <td className="py-3 px-4 font-semibold">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-muted">{order.user?.name}</td>
                    <td className="py-3 px-4 font-semibold">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          ORDER_STATUS_COLORS[order.status] as
                            | 'green'
                            | 'yellow'
                            | 'red'
                            | 'blue'
                            | 'orange'
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted text-xs">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <button className="text-g2 hover:underline text-xs font-semibold">
                            Detail
                          </button>
                        </Link>
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() =>
                              updateStatus.mutate({
                                id: order.id,
                                status: 'CONFIRMED',
                              })
                            }
                            className="text-blue-500 hover:underline text-xs font-semibold"
                          >
                            Konfirmasi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-muted">Tidak ada pesanan</div>
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
    </div>
  );
}
