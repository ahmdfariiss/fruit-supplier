'use client';

import { useParams, useRouter } from 'next/navigation';
import { useOrder } from '@/hooks/useOrders';
import { formatRupiah, formatDateTime } from '@/lib/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import PaymentInfo from '@/components/checkout/PaymentInfo';
import StarRating from '@/components/ui/StarRating';
import type { OrderStatus } from '@/types/order';
import { useState, useRef } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image';

const TIMELINE_STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'PENDING', label: 'Dibuat', icon: '📝' },
  { status: 'CONFIRMED', label: 'Dikonfirmasi', icon: '✅' },
  { status: 'PROCESSING', label: 'Diproses', icon: '📦' },
  { status: 'SHIPPED', label: 'Dikirim', icon: '🚚' },
  { status: 'DONE', label: 'Selesai', icon: '🎉' },
];

const STATUS_ORDER: Record<string, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPED: 3,
  DONE: 4,
  CANCELLED: -1,
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: order, isLoading } = useOrder(params.id as string);
  const user = useAuthStore((s) => s.user);

  // Payment proof upload state
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Review state
  const [reviewProduct, setReviewProduct] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(
    new Set(),
  );

  const handleUploadPaymentProof = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    // Validate filename matches order number
    const fileNameWithoutExt = file.name.replace(/\.[^.]+$/, '');
    if (fileNameWithoutExt !== order?.orderNumber) {
      setUploadMsg(
        `❌ Nama file harus sesuai kode pesanan: ${order?.orderNumber}. Contoh: ${order?.orderNumber}.jpg`,
      );
      return;
    }

    setUploading(true);
    setUploadMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/orders/${order?.id}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadMsg('✅ Bukti pembayaran berhasil diunggah!');
      queryClient.invalidateQueries({ queryKey: ['order', params.id] });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const msg = axiosErr?.response?.data?.error || 'Gagal mengunggah bukti pembayaran.';
      setUploadMsg(`❌ ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitReview = async (productId: string) => {
    if (!order) return;
    setReviewSubmitting(true);
    try {
      await api.post('/reviews', {
        productId,
        orderId: order.id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      });
      setReviewedProducts((prev) => new Set(prev).add(productId));
      setReviewProduct(null);
      setReviewRating(5);
      setReviewComment('');
      queryClient.invalidateQueries({ queryKey: ['order', params.id] });
    } catch {
      // Review may already exist
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <span className="text-5xl mb-4">📦</span>
          <h2 className="text-xl font-bold text-ink">
            Pesanan tidak ditemukan
          </h2>
        </div>
        <Footer />
      </>
    );
  }

  const currentStep = STATUS_ORDER[order.status] ?? -1;
  const isCancelled = order.status === 'CANCELLED';

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-[6%] min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={() => router.push('/orders')}
                className="text-sm text-muted hover:text-g1 transition-colors mb-2 flex items-center gap-1"
              >
                ← Kembali ke Pesanan
              </button>
              <h1 className="font-lora text-2xl font-semibold text-ink">
                {order.orderNumber}
              </h1>
              <p className="text-sm text-muted">
                {formatDateTime(order.createdAt)} ·{' '}
                {order.buyerType === 'RESELLER' ? 'Reseller' : 'Konsumen'}
              </p>
            </div>
            <Badge
              variant={
                ORDER_STATUS_COLORS[order.status as OrderStatus] as
                  | 'green'
                  | 'yellow'
                  | 'red'
                  | 'blue'
                  | 'gray'
                  | 'orange'
              }
              size="md"
            >
              {ORDER_STATUS_LABELS[order.status as OrderStatus]}
            </Badge>
          </div>

          {/* Timeline Progress */}
          {!isCancelled && (
            <div className="bg-white rounded-3xl border border-faint p-6 mb-6">
              <h3 className="font-bold text-ink text-sm mb-5">
                Status Pesanan
              </h3>
              <div className="flex items-center justify-between relative">
                {/* Line */}
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-faint z-0" />
                <div
                  className="absolute top-5 left-[10%] h-0.5 bg-g1 z-0 transition-all duration-500"
                  style={{
                    width: `${Math.max(0, Math.min(currentStep / (TIMELINE_STEPS.length - 1), 1)) * 80}%`,
                  }}
                />
                {TIMELINE_STEPS.map((step, idx) => (
                  <div
                    key={step.status}
                    className="flex flex-col items-center z-10 relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all ${
                        idx <= currentStep
                          ? 'bg-g1 text-white shadow-md'
                          : 'bg-g6 text-muted border border-faint'
                      }`}
                    >
                      {step.icon}
                    </div>
                    <span
                      className={`text-[0.68rem] font-bold mt-2 ${
                        idx <= currentStep ? 'text-g1' : 'text-muted'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCancelled && (
            <div className="bg-red/5 border border-red/20 rounded-3xl p-6 mb-6 text-center">
              <span className="text-3xl">🚫</span>
              <p className="font-bold text-red mt-2">Pesanan Dibatalkan</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Order Items */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-faint p-6">
                <h3 className="font-bold text-ink mb-4">Produk</h3>
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id}>
                      <div className="flex items-center justify-between py-3 border-b border-faint last:border-0">
                        <div className="flex items-center gap-3">
                          {(item.productImage || item.product?.imageUrl) && (
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-g6 flex-shrink-0">
                              <Image
                                src={getImageUrl(
                                  item.productImage ||
                                  item.product?.imageUrl ||
                                  ''
                                )}
                                alt={item.productName}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm text-ink">
                              {item.product?.name || item.productName}
                            </p>
                            <p className="text-xs text-muted">
                              {item.quantity} × {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-ink text-sm">
                          {formatRupiah(item.quantity * item.price)}
                        </span>
                      </div>

                      {/* Review form for DONE orders */}
                      {order.status === 'DONE' &&
                        user &&
                        !reviewedProducts.has(item.productId) && (
                          <div className="pl-15 pt-2">
                            {reviewProduct === item.productId ? (
                              <div className="bg-g6 rounded-2xl p-4 border border-faint">
                                <p className="text-xs font-bold text-muted mb-2">
                                  Tulis ulasan untuk {item.productName}
                                </p>
                                <div className="mb-3">
                                  <StarRating
                                    rating={reviewRating}
                                    interactive
                                    onChange={(r: number) => setReviewRating(r)}
                                    size="md"
                                  />
                                </div>
                                <textarea
                                  value={reviewComment}
                                  onChange={(e) =>
                                    setReviewComment(e.target.value)
                                  }
                                  placeholder="Tulis komentar (opsional)..."
                                  className="w-full rounded-xl border border-faint p-3 text-sm resize-none h-20 focus:border-g3 focus:outline-none"
                                />
                                <div className="flex gap-2 mt-2">
                                  <button
                                    onClick={() =>
                                      handleSubmitReview(item.productId)
                                    }
                                    disabled={reviewSubmitting}
                                    className="px-4 py-2 bg-g1 text-white text-xs font-bold rounded-xl hover:bg-g2 transition-colors disabled:opacity-50"
                                  >
                                    {reviewSubmitting
                                      ? 'Mengirim...'
                                      : 'Kirim Ulasan'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReviewProduct(null);
                                      setReviewRating(5);
                                      setReviewComment('');
                                    }}
                                    className="px-4 py-2 bg-g6 text-muted text-xs font-bold rounded-xl border border-faint hover:bg-g5"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReviewProduct(item.productId)}
                                className="text-xs font-bold text-g1 hover:text-g2 transition-colors"
                              >
                                ⭐ Beri Ulasan
                              </button>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-faint pt-4 mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-semibold">
                      {formatRupiah(order.subtotal)}
                    </span>
                  </div>
                  {Number(order.shippingCost) > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted">Ongkos Kirim</span>
                      <span className="font-semibold">
                        {formatRupiah(order.shippingCost)}
                      </span>
                    </div>
                  )}
                  {Number(order.discountAmount) > 0 && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-g3">Diskon</span>
                      <span className="font-semibold text-g3">
                        −{formatRupiah(order.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between mt-3 pt-3 border-t border-faint">
                    <span className="font-bold text-ink">Total</span>
                    <span className="font-extrabold text-g1 text-lg">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-white rounded-3xl border border-faint p-6">
                <h3 className="font-bold text-ink mb-4">Pengiriman</h3>
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
                    <span className="text-muted">Alamat:</span>{' '}
                    <span className="font-semibold">
                      {order.shippingAddress}
                    </span>
                  </p>
                  {order.notes && (
                    <p>
                      <span className="text-muted">Catatan:</span>{' '}
                      <span className="font-semibold">{order.notes}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar: Payment + Upload */}
            <div className="space-y-4 lg:sticky lg:top-28 self-start">
              {/* Payment Info for PENDING */}
              {order.status === 'PENDING' && (
                <>
                  <PaymentInfo orderNumber={order.orderNumber} />

                  {/* Upload Bukti Pembayaran */}
                  <div className="bg-white rounded-3xl border border-faint p-6">
                    <h3 className="font-bold text-ink mb-3 text-sm">
                      📤 Upload Bukti Transfer
                    </h3>
                    <p className="text-xs text-muted mb-2">
                      Unggah foto bukti transfer agar pesanan Anda segera
                      diproses.
                    </p>
                    <div className="bg-[#fff8e1] border border-[#ffe082] rounded-xl px-3 py-2 mb-4">
                      <p className="text-xs font-bold text-[#c47d00]">
                        ⚠️ Nama file harus: <span className="font-mono">{order.orderNumber}.jpg</span>
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-g1 file:text-white file:font-bold file:text-xs file:cursor-pointer hover:file:bg-g2 mb-3"
                    />
                    <button
                      onClick={handleUploadPaymentProof}
                      disabled={uploading}
                      className="w-full py-2.5 bg-g1 text-white text-sm font-bold rounded-xl hover:bg-g2 transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Mengunggah...' : 'Unggah Bukti'}
                    </button>
                    {uploadMsg && (
                      <p
                        className={`text-xs mt-2 font-semibold ${uploadMsg.startsWith('✅') ? 'text-g1' : 'text-red'}`}
                      >
                        {uploadMsg}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Show uploaded payment proof */}
              {order.paymentProofUrl && (
                <div className="bg-white rounded-3xl border border-faint p-6">
                  <h3 className="font-bold text-ink mb-3 text-sm">
                    📷 Bukti Pembayaran
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-faint">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getImageUrl(order.paymentProofUrl)}
                      alt="Bukti pembayaran"
                      className="w-full object-contain max-h-[300px]"
                    />
                  </div>
                </div>
              )}

              {/* Invoice Download */}
              <div className="bg-white rounded-3xl border border-faint p-6">
                <h3 className="font-bold text-ink mb-3 text-sm">📄 Invoice</h3>
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/invoice`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 bg-g6 text-ink text-sm font-bold rounded-xl text-center border border-faint hover:bg-g5 transition-colors"
                >
                  📥 Unduh Invoice PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
