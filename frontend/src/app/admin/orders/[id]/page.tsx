'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatRupiah, formatDateTime } from '@/lib/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import type { OrderStatus } from '@/types/order';
import { getImageUrl } from '@/lib/image';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DONE', 'CANCELLED'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [updating, setUpdating] = useState(false);
  const [trackingNote, setTrackingNote] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/orders/${params.id}`);
      return data.data;
    },
  });

  const handleUpdateStatus = async () => {
    if (!newStatus || !order) return;
    setUpdating(true);
    try {
      await api.patch(`/admin/orders/${order.id}/status`, {
        status: newStatus,
        ...(trackingNote ? { note: trackingNote } : {}),
      });
      queryClient.invalidateQueries({ queryKey: ['admin-order', params.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setNewStatus('');
      setTrackingNote('');
    } catch {
      alert('Gagal update status');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <span className="text-4xl block mb-3">📦</span>
        <p className="text-muted">Pesanan tidak ditemukan</p>
        <button onClick={() => router.push('/admin/orders')} className="mt-4 text-g1 font-bold text-sm">
          ← Kembali
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push('/admin/orders')}
          className="text-sm text-muted hover:text-g1 transition-colors font-semibold"
        >
          ← Pesanan
        </button>
        <div className="flex-1">
          <h1 className="font-lora text-xl font-semibold text-ink">{order.orderNumber}</h1>
          <p className="text-xs text-muted">{formatDateTime(order.createdAt)}</p>
        </div>
        <Badge
          variant={ORDER_STATUS_COLORS[order.status] as 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'orange'}
          size="md"
        >
          {ORDER_STATUS_LABELS[order.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-faint p-5">
            <h3 className="font-bold text-ink mb-4">Produk Dipesan</h3>
            <div className="space-y-3">
              {order.items?.map((item: {
                id: string; productName: string; productImage: string | null;
                quantity: number; price: number; subtotal: number;
              }) => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-faint last:border-0">
                  <div className="w-10 h-10 rounded-xl bg-g6 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.productImage
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={getImageUrl(item.productImage)} alt={item.productName} className="w-full h-full object-cover" />
                      : <span className="text-xl">🍊</span>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.productName}</p>
                    <p className="text-xs text-muted">{item.quantity} × {formatRupiah(item.price)}</p>
                  </div>
                  <span className="font-bold text-sm">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="pt-4 mt-2 space-y-1.5">
              <div className="flex justify-between text-sm text-muted">
                <span>Subtotal</span><span>{formatRupiah(order.subtotal)}</span>
              </div>
              {Number(order.shippingCost) > 0 && (
                <div className="flex justify-between text-sm text-muted">
                  <span>Ongkir</span><span>{formatRupiah(order.shippingCost)}</span>
                </div>
              )}
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-sm text-g3">
                  <span>Diskon</span><span>-{formatRupiah(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base border-t border-faint pt-2 mt-1">
                <span>Total</span><span className="text-g1">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-faint p-5">
            <h3 className="font-bold text-ink mb-3">Info Pengiriman</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted">Nama:</span> <span className="font-semibold ml-1">{order.shippingName}</span></p>
              <p><span className="text-muted">Telepon:</span> <span className="font-semibold ml-1">{order.shippingPhone}</span></p>
              <p><span className="text-muted">Alamat:</span> <span className="font-semibold ml-1">{order.shippingAddress}</span></p>
              {order.notes && <p><span className="text-muted">Catatan:</span> <span className="font-semibold ml-1 italic">{order.notes}</span></p>}
            </div>
          </div>

          {/* Payment Proof */}
          {order.paymentProofUrl && (
            <div className="bg-white rounded-2xl border border-faint p-5">
              <h3 className="font-bold text-ink mb-3">Bukti Pembayaran</h3>
              <div className="rounded-xl overflow-hidden border border-faint">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(order.paymentProofUrl)}
                  alt="Bukti bayar"
                  className="w-full max-h-[400px] object-contain"
                />
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${order.paymentProofUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-xs font-bold text-g1 hover:underline"
              >
                📷 Buka gambar penuh
              </a>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-faint p-5">
            <h3 className="font-bold text-ink mb-3">Pelanggan</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-g5 flex items-center justify-center font-extrabold text-g1">
                {order.user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-bold text-sm">{order.user?.name || order.shippingName}</p>
                <p className="text-xs text-muted">{order.user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                order.buyerType === 'RESELLER' ? 'bg-g5 text-g1' : 'bg-blue-50 text-blue-600'
              }`}>
                {order.buyerType === 'RESELLER' ? '🏪 Reseller' : '🛒 Konsumen'}
              </span>
            </div>
          </div>

          {/* Update Status */}
          {order.status !== 'DONE' && order.status !== 'CANCELLED' && (
            <div className="bg-white rounded-2xl border border-faint p-5">
              <h3 className="font-bold text-ink mb-4">Update Status</h3>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm mb-3 outline-none focus:border-g3 transition-colors"
              >
                <option value="">Pilih status baru...</option>
                {ALL_STATUSES.filter(s => s !== order.status).map(s => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
              <textarea
                value={trackingNote}
                onChange={(e) => setTrackingNote(e.target.value)}
                placeholder="Catatan (opsional)..."
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm resize-none h-16 mb-3 outline-none focus:border-g3 transition-colors"
              />
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || updating}
                className="w-full py-2.5 bg-g1 text-white rounded-xl text-sm font-bold hover:bg-g2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {updating ? '⏳ Menyimpan...' : '✅ Update Status'}
              </button>
            </div>
          )}

          {/* Invoice */}
          <div className="bg-white rounded-2xl border border-faint p-5">
            <h3 className="font-bold text-ink mb-3">Invoice</h3>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/invoice`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 bg-g6 text-ink text-sm font-bold rounded-xl text-center border border-faint hover:bg-g5 transition-colors no-underline"
            >
              📥 Unduh Invoice PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}