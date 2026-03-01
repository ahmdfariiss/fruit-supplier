'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/formatters';
import Spinner from '@/components/ui/Spinner';

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Pendapatan',
      value: formatRupiah(stats?.totalRevenue || 0),
      icon: '💰',
      color: 'bg-g6 text-g1',
    },
    {
      label: 'Total Pesanan',
      value: stats?.totalOrders || 0,
      icon: '📦',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total Produk',
      value: stats?.totalProducts || 0,
      icon: '🍎',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Total Pengguna',
      value: stats?.totalUsers || 0,
      icon: '👥',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div>
      <h1 className="font-lora text-2xl font-semibold text-ink mb-8">
        Dashboard
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl border border-faint p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl ${kpi.color} flex items-center justify-center text-lg`}
              >
                {kpi.icon}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-ink">{kpi.value}</p>
            <p className="text-xs text-muted font-semibold mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-faint p-6">
        <h2 className="font-bold text-ink mb-4">Pesanan Terbaru</h2>
        {stats?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-faint">
                  <th className="text-left py-3 px-2 font-semibold text-muted text-xs uppercase">
                    No. Pesanan
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-muted text-xs uppercase">
                    Pelanggan
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-muted text-xs uppercase">
                    Total
                  </th>
                  <th className="text-left py-3 px-2 font-semibold text-muted text-xs uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(
                  (order: {
                    id: string;
                    orderNumber: string;
                    total: number;
                    status: string;
                    user: { name: string };
                  }) => (
                    <tr key={order.id} className="border-b border-faint/50">
                      <td className="py-3 px-2 font-semibold">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-2 text-muted">
                        {order.user?.name}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-g5 text-g1">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted">Belum ada pesanan</p>
        )}
      </div>
    </div>
  );
}
