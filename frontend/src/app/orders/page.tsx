'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { formatRupiah, formatDateTime } from '@/lib/formatters';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import type { Order, OrderStatus } from '@/types/order';

/* ═══════════════  STATUS CONFIG  ═══════════════ */
const STATUS_MAP: Record<
  OrderStatus,
  { label: string; cls: string; emoji: string }
> = {
  PENDING: {
    label: 'Menunggu Pembayaran',
    cls: 'bg-[#fff3e0] text-[#c47d00]',
    emoji: '⏳',
  },
  CONFIRMED: {
    label: 'Pembayaran Dikonfirmasi',
    cls: 'bg-[#e3f2fd] text-[#0779e4]',
    emoji: '✅',
  },
  PROCESSING: { label: 'Sedang Diproses', cls: 'bg-g5 text-g1', emoji: '🔄' },
  SHIPPED: {
    label: 'Dikirim',
    cls: 'bg-[#f3e5f5] text-[#7b1fa2]',
    emoji: '📦',
  },
  DONE: { label: 'Selesai', cls: 'bg-[#e8f5e9] text-[#2e7d32]', emoji: '✨' },
  CANCELLED: { label: 'Dibatalkan', cls: 'bg-[#fde8e0] text-red', emoji: '❌' },
};

const TL_STEPS: { emoji: string; label: string; status: OrderStatus }[] = [
  { emoji: '📋', label: 'Pesanan Dibuat', status: 'PENDING' },
  { emoji: '💳', label: 'Dikonfirmasi', status: 'CONFIRMED' },
  { emoji: '🔄', label: 'Diproses', status: 'PROCESSING' },
  { emoji: '📦', label: 'Dikirim', status: 'SHIPPED' },
  { emoji: '✨', label: 'Selesai', status: 'DONE' },
];

const STATUS_ORDER: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DONE',
];

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: '🗂️ Semua' },
  { value: 'PENDING', label: '⏳ Menunggu' },
  { value: 'CONFIRMED', label: '✅ Dikonfirmasi' },
  { value: 'PROCESSING', label: '🔄 Diproses' },
  { value: 'SHIPPED', label: '📦 Dikirim' },
  { value: 'DONE', label: '✨ Selesai' },
  { value: 'CANCELLED', label: '❌ Dibatalkan' },
];

function getStepNumber(status: OrderStatus): number {
  if (status === 'CANCELLED') return 0;
  const idx = STATUS_ORDER.indexOf(status);
  return idx >= 0 ? idx + 1 : 1;
}

export default function OrdersPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState<Record<string, boolean>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const { data, isLoading, refetch } = useOrders(
    statusFilter || undefined,
    page,
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const orders = data?.data || [];
  const pagination = data?.pagination;

  const toggleUpload = (id: string) =>
    setUploadOpen((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleUploadPayment = async (orderId: string, file: File) => {
    setUploading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/orders/${orderId}/payment-proof`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast(
        '📸 Bukti transfer berhasil diunggah! Admin akan verifikasi segera.',
        'success',
      );
      toggleUpload(orderId);
      refetch();
    } catch {
      toast('Gagal mengunggah bukti transfer. Coba lagi.', 'error');
    } finally {
      setUploading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin text-4xl">🔄</div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="pt-[110px] pb-10 px-[6%] bg-g6 relative overflow-hidden text-center">
        <div className="absolute -right-[100px] -top-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,207,111,.2)_0%,transparent_65%)] pointer-events-none" />
        <h1 className="font-lora text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight mb-2.5">
          Pesanan <em className="text-g2">Saya</em>
        </h1>
        <p className="text-[0.95rem] text-muted leading-relaxed max-w-[500px] mx-auto">
          Pantau status pesanan, upload bukti transfer, dan lihat riwayat
          belanja.
        </p>
      </section>

      {/* Status Filter */}
      <div className="flex gap-2 justify-center flex-wrap px-[6%] -mt-[18px] relative z-[2] mb-8 animate-fadeInUp">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setStatusFilter(f.value);
              setPage(1);
            }}
            className={`flex items-center gap-1.5 py-2.5 px-5 rounded-pill border-[1.5px] text-[0.82rem] font-bold cursor-pointer transition-all shadow-[0_2px_12px_rgba(45,90,0,.06)]
              ${
                statusFilter === f.value
                  ? 'bg-g1 text-white border-g1 shadow-[0_4px_18px_rgba(45,90,0,.35)]'
                  : 'bg-white text-muted border-faint hover:border-g3 hover:text-g1 hover:-translate-y-0.5'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="px-[6%] pb-20 max-w-[960px] mx-auto animate-fadeInUp">
        {isLoading ? (
          <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 text-center">
            <div className="animate-spin text-4xl mx-auto mb-4">📦</div>
            <p className="text-muted">Memuat pesanan...</p>
          </div>
        ) : !orders.length ? (
          <div className="bg-white rounded-3xl p-8 shadow-card border border-faint/30">
            <div className="text-center py-12 text-muted">
              <span className="text-[3.5rem] block mb-3.5">📦</span>
              <h3 className="font-lora text-[1.3rem] text-ink mb-2">
                Belum ada pesanan
              </h3>
              <p className="text-[0.85rem] leading-relaxed mb-5">
                {statusFilter
                  ? 'Tidak ada pesanan dengan status ini.'
                  : 'Yuk mulai belanja buah segar!'}
              </p>
              <a
                href="/products"
                className="inline-block px-8 py-3 bg-g1 text-white rounded-pill text-[0.92rem] font-extrabold no-underline shadow-[0_4px_16px_rgba(45,90,0,.3)] hover:bg-g2 hover:-translate-y-0.5 transition-all"
              >
                🍎 Jelajahi Produk
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-[0.82rem] text-muted font-semibold">
              Ditemukan{' '}
              <b className="text-ink">
                {pagination?.totalItems || orders.length}
              </b>{' '}
              pesanan
            </div>

            {orders.map((o: Order) => {
              const s = STATUS_MAP[o.status] || STATUS_MAP.PENDING;
              const step = getStepNumber(o.status);
              const isCancelled = o.status === 'CANCELLED';

              return (
                <div
                  key={o.id}
                  className="bg-white rounded-3xl border border-faint overflow-hidden mb-5 shadow-[0_4px_16px_rgba(45,90,0,.05)]"
                >
                  {/* Header */}
                  <div className="py-5 px-7 flex items-center justify-between border-b border-faint flex-wrap gap-3">
                    <div>
                      <div className="text-[0.85rem] font-extrabold tracking-wide">
                        {o.orderNumber}
                        {o.buyerType === 'RESELLER' && (
                          <span className="bg-g5 text-g1 text-[0.65rem] py-0.5 px-2 rounded-pill ml-1.5 font-extrabold">
                            RESELLER
                          </span>
                        )}
                      </div>
                      <div className="text-[0.78rem] text-muted">
                        {formatDateTime(o.createdAt)} · {o.shippingName}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold py-1.5 px-3 rounded-pill uppercase tracking-wider ${s.cls}`}
                    >
                      {s.emoji} {s.label}
                    </span>
                  </div>

                  {/* Timeline (skip if cancelled) */}
                  {!isCancelled && (
                    <div className="py-6 px-7">
                      <div className="flex relative mb-2">
                        <div className="absolute top-[17px] left-[16px] right-[16px] h-0.5 bg-faint" />
                        <div
                          className="absolute top-[17px] left-[16px] h-0.5 bg-g4 transition-all duration-700 z-0"
                          style={{
                            width: `${((step - 1) / 4) * 100}%`,
                            maxWidth: 'calc(100% - 32px)',
                          }}
                        />
                        {TL_STEPS.map((t, i) => (
                          <div
                            key={i}
                            className={`flex-1 flex flex-col items-center gap-2 relative z-[1]
                            ${i + 1 < step ? 'text-g1' : i + 1 === step ? 'text-g1' : 'text-muted'}`}
                          >
                            <div
                              className={`w-[34px] h-[34px] rounded-full border-2 flex items-center justify-center text-[0.85rem] transition-all
                              ${i + 1 < step ? 'bg-g4 border-g4' : i + 1 === step ? 'bg-g1 border-g1 shadow-[0_0_0_4px_rgba(69,125,0,.15)]' : 'bg-white border-faint'}`}
                            >
                              {i + 1 < step ? '✓' : t.emoji}
                            </div>
                            <div
                              className={`text-[0.68rem] font-bold text-center leading-tight hidden sm:block
                              ${i + 1 <= step ? 'text-g1 font-extrabold' : 'text-muted'}`}
                            >
                              {t.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="px-7 pb-4">
                    {o.items?.map((it, i) => (
                      <div
                        key={it.id}
                        className={`flex items-center gap-3 py-3 ${i < (o.items?.length || 0) - 1 ? 'border-b border-faint' : ''}`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-g6 flex items-center justify-center shrink-0 overflow-hidden">
                          {it.product?.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={it.product.imageUrl}
                              alt={it.productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🍊</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <strong className="block text-[0.88rem] font-bold">
                            {it.productName}
                          </strong>
                          <span className="text-[0.75rem] text-muted">
                            {it.quantity} × {formatRupiah(it.price)}
                          </span>
                        </div>
                        <span className="text-[0.88rem] font-extrabold text-g1">
                          {formatRupiah(it.subtotal)}
                        </span>
                      </div>
                    ))}
                    {o.notes && (
                      <div className="text-[0.77rem] text-muted py-2 italic">
                        ✏️ Catatan: {o.notes}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="py-4 px-7 bg-g6 flex items-center justify-between flex-wrap gap-3">
                    <div className="text-[0.9rem] font-extrabold">
                      <span className="text-muted font-medium mr-2">Total</span>
                      <strong className="text-g1 text-base">
                        {formatRupiah(o.total)}
                      </strong>
                      {o.discountAmount > 0 && (
                        <span className="text-[0.75rem] text-g3 ml-2">
                          (-{formatRupiah(o.discountAmount)})
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {o.status === 'PENDING' && !o.paymentProofUrl && (
                        <button
                          onClick={() => toggleUpload(o.id)}
                          className="py-2 px-4 rounded-pill text-[0.78rem] font-bold cursor-pointer bg-g1 text-white border-none shadow-[0_2px_10px_rgba(45,90,0,.2)] hover:bg-g2 transition-all"
                        >
                          📤 Upload Bukti TF
                        </button>
                      )}
                      {o.status === 'PENDING' && o.paymentProofUrl && (
                        <span className="py-2 px-4 rounded-pill text-[0.78rem] font-bold bg-[#fff3e0] text-[#c47d00]">
                          ⏳ Menunggu Verifikasi
                        </span>
                      )}
                      {o.status === 'DONE' && (
                        <button
                          onClick={() => router.push(`/orders/${o.id}`)}
                          className="py-2 px-4 rounded-pill text-[0.78rem] font-bold cursor-pointer bg-[#fff8e1] text-[#f59e0b] border-[1.5px] border-[#f59e0b]/30 hover:bg-[#fef3c7] transition-all"
                        >
                          ⭐ Beri Ulasan
                        </button>
                      )}
                      <button
                        onClick={() => router.push(`/orders/${o.id}`)}
                        className="py-2 px-4 rounded-pill text-[0.78rem] font-bold cursor-pointer bg-white border-[1.5px] border-faint text-muted hover:border-g2 hover:text-g2 transition-all"
                      >
                        📋 Detail
                      </button>
                    </div>
                  </div>

                  {/* Upload Section */}
                  {uploadOpen[o.id] && (
                    <div className="px-7 py-4 border-t border-faint bg-[#fffbf0]">
                      <h4 className="text-[0.88rem] font-extrabold mb-3">
                        📤 Upload Bukti Transfer
                      </h4>
                      <label
                        className={`block border-2 border-dashed border-g4 rounded-[14px] p-5 text-center cursor-pointer bg-g6 hover:border-g2 hover:bg-g5 transition-all ${uploading[o.id] ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadPayment(o.id, file);
                          }}
                        />
                        {uploading[o.id] ? (
                          <>
                            <span className="text-[2rem] block mb-2 animate-spin">
                              ⏳
                            </span>
                            <strong className="text-[0.88rem] block">
                              Mengunggah...
                            </strong>
                          </>
                        ) : (
                          <>
                            <span className="text-[2rem] block mb-2">📷</span>
                            <strong className="text-[0.88rem] block">
                              Klik untuk pilih foto bukti transfer
                            </strong>
                            <p className="text-[0.82rem] text-muted mt-1">
                              JPG, PNG — maks. 5MB
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-[38px] h-[38px] rounded-full border-[1.5px] border-faint bg-white flex items-center justify-center text-base hover:border-g3 hover:bg-g6 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-[38px] h-[38px] rounded-full border-[1.5px] flex items-center justify-center text-[0.88rem] font-bold transition-all
                      ${
                        page === p
                          ? 'bg-g1 text-white border-g1'
                          : 'border-faint bg-white text-muted hover:border-g3 hover:bg-g6'
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page >= pagination.totalPages}
                  className="w-[38px] h-[38px] rounded-full border-[1.5px] border-faint bg-white flex items-center justify-center text-base hover:border-g3 hover:bg-g6 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            )}

            {/* Help Card */}
            <div className="bg-g1 rounded-[20px] p-7 text-center mt-6 max-w-[420px] mx-auto">
              <h4 className="font-lora text-[1.1rem] text-white font-semibold mb-1.5">
                Ada kendala dengan pesanan?
              </h4>
              <p className="text-[0.82rem] text-white/60 mb-4">
                Hubungi admin kami untuk bantuan lebih lanjut
              </p>
              <button
                onClick={() =>
                  toast('💬 Menghubungi admin via WhatsApp...', 'info')
                }
                className="bg-g4 text-ink border-none py-2.5 px-6 rounded-pill text-[0.85rem] font-extrabold cursor-pointer hover:bg-g5 transition-all"
              >
                💬 Chat Admin WA
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
