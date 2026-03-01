'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatRupiah, formatDateTime } from '@/lib/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import { OrderStatus } from '@/types/order';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Image from 'next/image';

const STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DONE',
];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['admin-order', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/orders/${params.id}`);
      return data.data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) =>
      api.patch(`/admin/orders/${params.id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-order', params.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-muted">
        Pesanan tidak ditemukan
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus =
    currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
      ? STATUS_FLOW[currentIdx + 1]
      : null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.push('/admin/orders')}>
          ← Kembali
        </Button>
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Pesanan #{order.orderNumber}
        </h1>
        <Badge
          variant={
            ORDER_STATUS_COLORS[order.status as OrderStatus] as
              | 'green'
              | 'yellow'
              | 'red'
              | 'blue'
              | 'orange'
          }
        >
          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-faint p-6">
          <h2 className="font-bold text-ink mb-4">Item Pesanan</h2>
          <div className="space-y-3">
            {order.items?.map(
              (item: {
                id: string;
                quantity: number;
                price: number;
                productName: string;
                product?: { name: string; imageUrl: string | null };
              }) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-3 rounded-xl border border-faint/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-sand relative flex-shrink-0 overflow-hidden">
                    {item.product?.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🍊</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">
                      {item.product?.name || item.productName}
                    </p>
                    <p className="text-xs text-muted">
                      {item.quantity}x @ {formatRupiah(item.price)}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    {formatRupiah(item.quantity * item.price)}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="border-t border-faint mt-4 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-semibold">
                {formatRupiah(order.subtotal)}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-g2">
                <span>Diskon</span>
                <span>-{formatRupiah(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold pt-2 border-t border-faint">
              <span>Total</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-faint p-6">
            <h3 className="font-bold text-ink mb-3">Informasi Pelanggan</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted">Nama:</span>{' '}
                <span className="font-semibold">{order.shippingName}</span>
              </p>
              <p>
                <span className="text-muted">Telepon:</span>{' '}
                <span className="font-semibold">{order.shippingPhone}</span>
              </p>
              <p>
                <span className="text-muted">Tipe:</span>{' '}
                <span className="font-semibold capitalize">
                  {order.buyerType}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-2xl border border-faint p-6">
            <h3 className="font-bold text-ink mb-3">Alamat Pengiriman</h3>
            <p className="text-sm text-muted">{order.shippingAddress}</p>
          </div>

          {/* Status Update */}
          {order.status !== 'CANCELLED' && order.status !== 'DONE' && (
            <div className="bg-white rounded-2xl border border-faint p-6">
              <h3 className="font-bold text-ink mb-3">Update Status</h3>
              <div className="space-y-2">
                {nextStatus && (
                  <Button
                    className="w-full"
                    onClick={() => updateStatus.mutate(nextStatus)}
                    disabled={updateStatus.isPending}
                  >
                    {updateStatus.isPending
                      ? 'Memproses...'
                      : `Ubah ke ${ORDER_STATUS_LABELS[nextStatus]}`}
                  </Button>
                )}
                {order.status !== 'DONE' && (
                  <Button
                    variant="ghost"
                    className="w-full text-red-500"
                    onClick={() => updateStatus.mutate('CANCELLED')}
                    disabled={updateStatus.isPending}
                  >
                    Batalkan Pesanan
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Payment Proof */}
          {order.paymentProofUrl && (
            <div className="bg-white rounded-2xl border border-faint p-6">
              <h3 className="font-bold text-ink mb-3">📷 Bukti Pembayaran</h3>
              <div className="rounded-xl overflow-hidden border border-faint">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={order.paymentProofUrl.startsWith('http') ? order.paymentProofUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${order.paymentProofUrl}`}
                  alt="Bukti pembayaran"
                  className="w-full object-contain max-h-[400px]"
                />
              </div>
              <a
                href={order.paymentProofUrl.startsWith('http') ? order.paymentProofUrl : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${order.paymentProofUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-bold text-g1 mt-2 hover:text-g2"
              >
                Buka di tab baru ↗
              </a>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-faint p-6">
            <h3 className="font-bold text-ink mb-3">Detail</h3>
            <div className="text-sm space-y-1 text-muted">
              <p>Dibuat: {formatDateTime(order.createdAt)}</p>
              <p>Diperbarui: {formatDateTime(order.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
