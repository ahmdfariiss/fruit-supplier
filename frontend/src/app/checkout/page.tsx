'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { formatRupiah } from '@/lib/formatters';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import api from '@/lib/api';
import { getImageUrl } from '@/lib/image';

/* ═══════════════  5-STEP INDICATOR (Spec §6.6)  ═══════════════ */
const STEPS = [
  { num: 1, label: 'Tipe Pembeli' },
  { num: 2, label: 'Review Cart' },
  { num: 3, label: 'Data Pengiriman' },
  { num: 4, label: 'Konfirmasi & Bayar' },
  { num: 5, label: 'Selesai' },
];

function StepBar({ current }: { current: number }) {
  return (
    <div className="pt-[100px] px-[6%] bg-g6">
      <nav aria-label="Langkah checkout" className="flex items-center justify-center gap-0 pb-10 max-w-[700px] mx-auto">
        {STEPS.map((s, i) => (
          <div
            key={s.num}
            className="flex flex-col items-center gap-1.5 flex-1 relative"
            aria-current={s.num === current ? 'step' : undefined}
          >
            {i < STEPS.length - 1 && (
              <div
                className={`absolute top-[16px] left-[60%] w-[80%] h-0.5 ${s.num < current ? 'bg-g4' : 'bg-faint'}`}
              />
            )}
            <div
              className={`w-[34px] h-[34px] rounded-full border-2 flex items-center justify-center text-[0.85rem] font-extrabold z-[1] transition-all
              ${s.num < current ? 'bg-g4 border-g4 text-g1' : s.num === current ? 'bg-g1 border-g1 text-white' : 'bg-white border-faint text-muted'}`}
            >
              {s.num < current ? '✓' : s.num}
            </div>
            <div
              className={`text-[0.7rem] font-bold text-center tracking-wide ${s.num === current ? 'text-g1 font-extrabold' : 'text-muted'}`}
            >
              {s.label}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

/* ═══════════════  MAIN CHECKOUT  ═══════════════ */
export default function CheckoutPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010/api/v1';
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const {
    items,
    buyerType,
    setBuyerType,
    totalPrice,
    fetchCart,
    isLoading: cartLoading,
  } = useCartStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addr, setAddr] = useState('');
  const [notes, setNotes] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherValid, setVoucherValid] = useState<boolean | null>(null);
  const [voucherMsg, setVoucherMsg] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Order result state
  const [orderId, setOrderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderDiscount, setOrderDiscount] = useState(0);
  const [orderSubtotal, setOrderSubtotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      if (user.name && !name) setName(user.name);
      if (user.phone && !phone) setPhone(user.phone);
      if (user.address && !addr) setAddr(user.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const subtotal = totalPrice();
  const finalTotal = Math.max(0, subtotal - voucherDiscount);

  // Compute items with reseller pricing & warnings
  const cartItemsWithPricing = items.map((item) => {
    const isReseller = buyerType === 'RESELLER';
    const meetsMin = item.quantity >= item.product.minOrderReseller;
    const usesResellerPrice = isReseller && meetsMin;
    const price = usesResellerPrice
      ? Number(item.product.priceReseller)
      : Number(item.product.priceConsumer);
    const needsWarning = isReseller && !meetsMin;
    return { ...item, price, usesResellerPrice, needsWarning };
  });

  const hasResellerWarnings = cartItemsWithPricing.some((i) => i.needsWarning);

  const validateVoucher = async () => {
    if (!voucherCode.trim()) {
      setVoucherValid(null);
      setVoucherMsg('');
      setVoucherDiscount(0);
      return;
    }
    try {
      const { data } = await api.post('/vouchers/validate', {
        code: voucherCode,
        orderTotal: subtotal,
      });
      setVoucherValid(true);
      setVoucherMsg(data.data?.message || 'Voucher valid!');
      setVoucherDiscount(Number(data.data?.discountAmount || 0));
      toast('🎉 Voucher valid!', 'success');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setVoucherValid(false);
      setVoucherMsg(axiosErr?.response?.data?.error || 'Voucher tidak valid');
      setVoucherDiscount(0);
      toast(
        '❌ ' + (axiosErr?.response?.data?.error || 'Voucher tidak valid'),
        'error',
      );
    }
  };

  const placeOrder = async () => {
    if (!name.trim() || !phone.trim()) {
      toast('⚠️ Isi nama dan nomor telepon dulu!', 'error');
      return;
    }
    if (!addr.trim()) {
      toast('⚠️ Isi alamat pengiriman!', 'error');
      return;
    }
    if (items.length === 0) {
      toast('⚠️ Keranjang kosong!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        buyerType,
        shippingName: name,
        shippingPhone: phone,
        shippingAddress: addr,
      };
      if (notes.trim()) payload.notes = notes;
      if (voucherCode.trim() && voucherValid) payload.voucherCode = voucherCode;

      const { data } = await api.post('/orders', payload);
      const order = data.data;

      setOrderId(order.id);
      setOrderNumber(order.orderNumber);
      setOrderTotal(Number(order.total));
      setOrderDiscount(Number(order.discountAmount || 0));
      setOrderSubtotal(Number(order.subtotal));

      toast(`🎉 Pesanan ${order.orderNumber} berhasil dibuat!`, 'success');
      goToStep(5);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      toast(
        axiosErr?.response?.data?.error || 'Gagal membuat pesanan. Coba lagi.',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goToStep = (target: number) => {
    setStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (authLoading || cartLoading) {
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

  const inputCls =
    'w-full py-2.5 px-3.5 border-[1.5px] border-faint rounded-xl text-[0.88rem] text-ink bg-white outline-none focus:border-g3 transition-colors';

  return (
    <>
      <Navbar />
      <StepBar current={step} />

      <main id="main-content">
        <h1 className="sr-only">Checkout - Langkah {step} dari 5</h1>

        {/* ═══ STEP 1: Pilih Tipe Pembeli (BuyerTypeSelector) ═══ */}
      {step === 1 && (
        <div className="max-w-[640px] mx-auto px-[6%] py-10 pb-20 animate-fadeInUp">
          <div className="bg-white rounded-3xl p-7 border border-faint">
            <div className="font-lora text-[1.2rem] font-semibold mb-2 flex items-center gap-2.5">
              <span className="text-[1.3rem]">👤</span> Pilih Tipe Pembeli
            </div>
            <p className="text-[0.85rem] text-muted mb-6">
              Pilih tipe pembeli Anda. Ini akan menentukan harga yang berlaku
              untuk seluruh proses checkout.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  [
                    'CONSUMER',
                    '🛒',
                    'Konsumen',
                    'Harga Eceran untuk pembelian rumah tangga',
                  ],
                  [
                    'RESELLER',
                    '🏪',
                    'Reseller / Toko',
                    'Harga Grosir untuk pembelian dalam jumlah besar',
                  ],
                ] as const
              ).map(([type, icon, title, desc]) => (
                <div
                  key={type}
                  onClick={() => setBuyerType(type)}
                  className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col items-center text-center gap-3
                    ${buyerType === type ? 'border-g1 bg-g6 shadow-[0_4px_20px_rgba(45,90,0,.12)]' : 'border-faint hover:border-g4'}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[1.6rem] ${buyerType === type ? 'bg-g1 text-white' : 'bg-g5'}`}
                  >
                    {icon}
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-extrabold mb-1">
                      {title}
                    </h4>
                    <p className="text-[0.78rem] text-muted">{desc}</p>
                  </div>
                  {buyerType === type && (
                    <div className="text-g1 text-[0.75rem] font-extrabold">
                      ✓ Dipilih
                    </div>
                  )}
                </div>
              ))}
            </div>

            {buyerType === 'RESELLER' && (
              <div className="mt-4 bg-[#fff8e1] border border-[#f59e0b]/30 rounded-xl p-3.5 text-[0.82rem] text-[#92400e] flex items-start gap-2">
                <span>💼</span>
                <span>
                  Harga reseller berlaku jika qty memenuhi minimum per produk.
                  Produk yang belum memenuhi minimum akan dihitung dengan harga
                  konsumen.
                </span>
              </div>
            )}

            <button
              onClick={() => {
                if (items.length === 0) {
                  toast('⚠️ Keranjang kosong! Tambahkan produk dulu.', 'error');
                  return;
                }
                goToStep(2);
              }}
              className="w-full py-4 bg-g1 text-white border-none rounded-pill text-[0.95rem] font-extrabold cursor-pointer mt-6 transition-all shadow-[0_4px_20px_rgba(45,90,0,.28)] hover:bg-g2 hover:-translate-y-0.5"
            >
              Lanjutkan →
            </button>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: Review Cart & Validasi ═══ */}
      {step === 2 && (
        <div className="max-w-[800px] mx-auto px-[6%] py-10 pb-20 animate-fadeInUp">
          <div className="bg-white rounded-3xl p-7 border border-faint">
            <div className="font-lora text-[1.2rem] font-semibold mb-2 flex items-center gap-2.5">
              <span className="text-[1.3rem]">🛒</span> Review Pesanan
            </div>
            <p className="text-[0.85rem] text-muted mb-5">
              Periksa kembali item belanjaan Anda sebelum melanjutkan.
              {buyerType === 'RESELLER' &&
                ' Harga disesuaikan dengan tipe reseller.'}
            </p>

            {/* Reseller global warning */}
            {hasResellerWarnings && (
              <div className="bg-red/5 border border-red/20 rounded-xl p-4 mb-5 flex items-start gap-2.5 text-[0.82rem]">
                <span className="text-red text-base mt-0.5">⚠️</span>
                <div>
                  <strong className="text-red block mb-0.5">
                    Perhatian Reseller
                  </strong>
                  <span className="text-red/80">
                    Beberapa produk belum memenuhi minimum order reseller dan
                    akan dihitung dengan harga konsumen. Kembali ke keranjang
                    untuk menambah jumlah.
                  </span>
                </div>
              </div>
            )}

            {/* Items */}
            <div className="divide-y divide-faint">
              {cartItemsWithPricing.map((item) => (
                <div key={item.id} className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-[52px] h-[52px] rounded-xl bg-g6 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.imageUrl ? (
                        <Image
                          src={getImageUrl(item.product.imageUrl)}
                          alt={item.product.name}
                          width={52}
                          height={52}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-[1.6rem]">🍊</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <strong className="block text-[0.88rem] font-bold">
                        {item.product.name}
                      </strong>
                      <span className="text-[0.78rem] text-muted">
                        {item.quantity} {item.product.unit} ×{' '}
                        {formatRupiah(item.price)}
                      </span>
                      {item.usesResellerPrice && (
                        <span className="ml-2 text-[0.68rem] bg-g5 text-g1 px-2 py-0.5 rounded-pill font-bold">
                          Harga Reseller
                        </span>
                      )}
                    </div>
                    <span className="text-[0.92rem] font-extrabold text-g1">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>

                  {/* Reseller warning per item */}
                  {item.needsWarning && (
                    <div className="mt-2 ml-[64px] bg-[#fef2f2] border border-red/15 rounded-lg px-3 py-2 text-[0.75rem] text-red flex items-center gap-1.5">
                      <span>⚠️</span>
                      <span>
                        Qty kurang dari minimum reseller (
                        {item.product.minOrderReseller} {item.product.unit}).
                        Dikenakan harga konsumen (
                        {formatRupiah(Number(item.product.priceConsumer))}).
                        Butuh tambah{' '}
                        {item.product.minOrderReseller - item.quantity}{' '}
                        {item.product.unit} lagi.
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t-2 border-faint pt-4 mt-2">
              <div className="flex justify-between text-[0.92rem]">
                <span className="text-muted font-medium">Subtotal</span>
                <span className="font-extrabold text-g1 text-lg">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => goToStep(1)}
                className="flex-1 py-3.5 bg-white text-ink border-[1.5px] border-faint rounded-pill text-[0.88rem] font-bold cursor-pointer hover:border-g2 hover:text-g2 transition-all"
              >
                ← Kembali
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="py-3.5 px-6 bg-white text-ink border-[1.5px] border-faint rounded-pill text-[0.88rem] font-bold cursor-pointer hover:border-g2 hover:text-g2 transition-all"
              >
                ✏️ Edit Keranjang
              </button>
              <button
                onClick={() => goToStep(3)}
                className="flex-1 py-3.5 bg-g1 text-white border-none rounded-pill text-[0.88rem] font-extrabold cursor-pointer transition-all shadow-[0_4px_20px_rgba(45,90,0,.28)] hover:bg-g2 hover:-translate-y-0.5"
              >
                Lanjutkan →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Data Pengiriman & Voucher ═══ */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7 px-[6%] py-10 pb-20 items-start animate-fadeInUp max-w-[1100px] mx-auto">
          <div>
            {/* Data Pengiriman */}
            <div className="bg-white rounded-3xl p-7 border border-faint mb-5">
              <div className="font-lora text-[1.1rem] font-semibold mb-5 flex items-center gap-2.5">
                <span className="text-[1.2rem]">📋</span> Data Pengiriman
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="shipping-name" className="text-[0.78rem] font-bold text-muted tracking-wide">
                    NAMA PENERIMA *
                  </label>
                  <input
                    id="shipping-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama lengkap penerima"
                    autoComplete="name"
                    className={inputCls}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="shipping-phone" className="text-[0.78rem] font-bold text-muted tracking-wide">
                    NO. TELEPON *
                  </label>
                  <input
                    id="shipping-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    autoComplete="tel"
                    className={inputCls}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 mb-3.5">
                <label htmlFor="shipping-address" className="text-[0.78rem] font-bold text-muted tracking-wide">
                  ALAMAT LENGKAP *
                </label>
                <textarea
                  id="shipping-address"
                  value={addr}
                  onChange={(e) => setAddr(e.target.value)}
                  placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota"
                  autoComplete="street-address"
                  className={`${inputCls} min-h-[80px] resize-y`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="shipping-notes" className="text-[0.78rem] font-bold text-muted tracking-wide">
                  CATATAN (opsional)
                </label>
                <textarea
                  id="shipping-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Misal: tolong pilihkan yang belum terlalu matang..."
                  className={`${inputCls} min-h-[60px] resize-y`}
                />
              </div>
            </div>

            {/* Voucher */}
            <div className="bg-white rounded-3xl p-7 border border-faint">
              <div className="font-lora text-[1.1rem] font-semibold mb-5 flex items-center gap-2.5">
                <span className="text-[1.2rem]">🎟️</span> Kode Voucher
              </div>
              <div className="flex gap-2">
                <input
                  id="voucher-code"
                  type="text"
                  value={voucherCode}
                  onChange={(e) => {
                    setVoucherCode(e.target.value.toUpperCase());
                    setVoucherValid(null);
                    setVoucherMsg('');
                    setVoucherDiscount(0);
                  }}
                  placeholder="Masukkan kode voucher"
                  className={`flex-1 ${inputCls} ${voucherValid === true ? 'border-g3' : voucherValid === false ? 'border-red' : ''}`}
                />
                <button
                  onClick={validateVoucher}
                  aria-label="Validasi kode voucher"
                  className="px-5 py-2.5 rounded-xl bg-g1 text-white text-[0.82rem] font-bold border-none cursor-pointer hover:bg-g2 transition-colors whitespace-nowrap"
                >
                  Validasi
                </button>
              </div>
              {voucherMsg && (
                <p
                  className={`text-[0.78rem] font-semibold mt-2 ${voucherValid ? 'text-g2' : 'text-red'}`}
                >
                  {voucherValid ? '✅' : '❌'} {voucherMsg}
                </p>
              )}
              {voucherValid && voucherDiscount > 0 && (
                <div className="mt-3 bg-g6 border border-g4 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-[0.82rem] text-g1 font-semibold">🎉 Potongan diskon</span>
                  <span className="text-[0.92rem] font-extrabold text-g1">-{formatRupiah(voucherDiscount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:sticky lg:top-[90px]">
            <div className="bg-white rounded-3xl p-6 border border-faint">
              <div className="font-lora text-[1rem] font-semibold mb-4 flex items-center gap-2">
                <span>🛒</span> Ringkasan
              </div>
              <div className="text-[0.82rem] text-muted mb-1">
                {items.length} produk ·{' '}
                {buyerType === 'RESELLER' ? 'Reseller' : 'Konsumen'}
              </div>
              {items.map((item) => {
                const price =
                  buyerType === 'RESELLER' &&
                  item.quantity >= item.product.minOrderReseller
                    ? Number(item.product.priceReseller)
                    : Number(item.product.priceConsumer);
                return (
                  <div
                    key={item.id}
                    className="flex justify-between text-[0.78rem] py-1.5 border-b border-faint last:border-none"
                  >
                    <span className="text-muted truncate max-w-[180px]">
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatRupiah(price * item.quantity)}
                    </span>
                  </div>
                );
              })}

              {/* Subtotal */}
              <div className="flex justify-between text-[0.85rem] pt-3 border-t border-faint mt-3">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatRupiah(subtotal)}</span>
              </div>

              {/* Diskon Voucher */}
              {voucherValid && voucherDiscount > 0 && (
                <div className="flex justify-between text-[0.85rem] py-1.5 text-g3">
                  <span className="flex items-center gap-1">
                    🎟️ Diskon Voucher
                  </span>
                  <span className="font-semibold">-{formatRupiah(voucherDiscount)}</span>
                </div>
              )}

              {/* Total Bayar */}
              <div className="flex justify-between text-base font-extrabold pt-3 border-t border-faint mt-1">
                <span>Total Bayar</span>
                <span className="text-g1">{formatRupiah(finalTotal)}</span>
              </div>

              {voucherValid && voucherDiscount > 0 && (
                <div className="mt-2 bg-g6 border border-g4 rounded-lg px-3 py-2 text-[0.75rem] text-g1 font-semibold flex items-center gap-1.5">
                  🎉 Anda hemat {formatRupiah(voucherDiscount)} dengan voucher <strong>{voucherCode}</strong>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2.5 mt-4">
              <button
                onClick={() => {
                  if (!name.trim() || !phone.trim() || !addr.trim()) {
                    toast(
                      '⚠️ Lengkapi data pengiriman terlebih dahulu!',
                      'error',
                    );
                    return;
                  }
                  goToStep(4);
                }}
                className="w-full py-3.5 bg-g1 text-white border-none rounded-pill text-[0.9rem] font-extrabold cursor-pointer transition-all shadow-[0_4px_20px_rgba(45,90,0,.28)] hover:bg-g2 hover:-translate-y-0.5"
              >
                Lanjutkan →
              </button>
              <button
                onClick={() => goToStep(2)}
                className="w-full py-3 bg-white text-ink border-[1.5px] border-faint rounded-pill text-[0.85rem] font-bold cursor-pointer hover:border-g2 hover:text-g2 transition-all"
              >
                ← Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 4: Konfirmasi & Instruksi Bayar ═══ */}
      {step === 4 && (
        <div className="max-w-[860px] mx-auto px-[6%] py-10 pb-20 animate-fadeInUp">
          <div className="bg-white rounded-3xl border border-faint overflow-hidden">
            {/* Header */}
            <div className="bg-g1 py-6 px-8">
              <h2 className="font-lora text-xl font-semibold text-white flex items-center gap-2.5">
                <span>📋</span> Konfirmasi Pesanan
              </h2>
              <p className="text-white/70 text-[0.82rem] mt-1">
                Periksa detail pesanan Anda sebelum mengonfirmasi.
              </p>
            </div>

            <div className="p-8">
              {/* Buyer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-faint">
                <div>
                  <div className="text-[0.7rem] font-extrabold tracking-widest uppercase text-muted mb-2">
                    Penerima
                  </div>
                  <div className="text-base font-extrabold mb-0.5">{name}</div>
                  <div className="text-[0.82rem] text-muted leading-relaxed">
                    📱 {phone}
                    <br />
                    📍 {addr}
                  </div>
                  {notes && (
                    <div className="text-[0.78rem] text-muted mt-1 italic">
                      📝 {notes}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[0.7rem] font-extrabold tracking-widest uppercase text-muted mb-2">
                    Tipe Pembelian
                  </div>
                  <div className="text-base font-extrabold mb-0.5">
                    {buyerType === 'RESELLER'
                      ? '🏪 Reseller / Toko'
                      : '🛒 Konsumen'}
                  </div>
                  {voucherValid && voucherCode && (
                    <div className="text-[0.78rem] text-g3 font-bold mt-1">
                      🎟️ Voucher: {voucherCode}
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr>
                    {['Produk', 'Qty', 'Harga', 'Subtotal'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className={`text-[0.7rem] font-extrabold tracking-widest uppercase text-muted py-2 px-3 text-left border-b-2 border-faint ${h === 'Subtotal' ? 'text-right' : ''}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cartItemsWithPricing.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-3 border-b border-faint text-[0.85rem]">
                        {item.product.name}
                        {item.needsWarning && (
                          <span className="text-[0.65rem] text-red ml-1">
                            (harga konsumen)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 border-b border-faint text-[0.85rem]">
                        {item.quantity} {item.product.unit}
                      </td>
                      <td className="py-3 px-3 border-b border-faint text-[0.85rem]">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="py-3 px-3 border-b border-faint text-[0.85rem] text-right font-bold text-g1">
                        {formatRupiah(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total */}
              <div className="flex justify-end mb-6">
                <div className="w-[280px]">
                  <div className="flex justify-between text-[0.85rem] text-muted py-1">
                    <span>Subtotal</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  {voucherValid && voucherDiscount > 0 && (
                    <div className="flex justify-between text-[0.85rem] text-g3 py-1">
                      <span>Diskon Voucher ({voucherCode})</span>
                      <span>-{formatRupiah(voucherDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[1.05rem] font-black pt-3 mt-2 border-t-2 border-faint">
                    <span>Total Bayar</span>
                    <span className="text-g1">{formatRupiah(finalTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-g6 border border-g4 rounded-2xl p-5 mb-6">
                <h4 className="text-[0.85rem] font-extrabold mb-3 text-g1">
                  💳 Rekening Tujuan Transfer
                </h4>
                {[
                  { label: 'Bank', value: 'BCA' },
                  {
                    label: 'No. Rekening',
                    value: '1234-5678-90',
                    copyable: true,
                    copyVal: '1234567890',
                  },
                  { label: 'Atas Nama', value: 'FicPact Supplier' },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center justify-between py-2.5 border-b border-faint last:border-none"
                  >
                    <span className="text-[0.8rem] text-muted">{r.label}</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-[0.9rem] font-extrabold">
                        {r.value}
                      </strong>
                      {r.copyable && (
                        <button
                          onClick={() => {
                            navigator.clipboard?.writeText(r.copyVal!);
                            toast('✅ Nomor rekening disalin!', 'success');
                          }}
                          aria-label={`Salin ${r.label}`}
                          className="bg-g1 text-white border-none py-1 px-3 rounded-pill text-[0.72rem] font-bold cursor-pointer hover:bg-g2 transition-colors"
                        >
                          Salin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2.5">
                  <span className="text-[0.8rem] text-muted">
                    Jumlah Transfer
                  </span>
                  <div className="flex items-center gap-2">
                    <strong className="text-g1 text-base font-black">
                      {formatRupiah(finalTotal)}
                    </strong>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(String(finalTotal));
                        toast('✅ Jumlah transfer disalin!', 'success');
                      }}
                      aria-label="Salin jumlah transfer"
                      className="bg-g1 text-white border-none py-1 px-3 rounded-pill text-[0.72rem] font-bold cursor-pointer hover:bg-g2 transition-colors"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>

              {/* Voucher savings banner */}
              {voucherValid && voucherDiscount > 0 && (
                <div className="bg-g6 border border-g4 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <span className="text-[1.5rem]">🎉</span>
                  <div>
                    <div className="text-[0.85rem] font-extrabold text-g1">
                      Anda hemat {formatRupiah(voucherDiscount)}!
                    </div>
                    <div className="text-[0.78rem] text-muted">
                      Voucher <strong>{voucherCode}</strong> berhasil diterapkan pada pesanan ini.
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => goToStep(3)}
                  className="flex-1 py-3.5 bg-white text-ink border-[1.5px] border-faint rounded-pill text-[0.88rem] font-bold cursor-pointer hover:border-g2 hover:text-g2 transition-all"
                >
                  ← Kembali
                </button>
                <button
                  onClick={placeOrder}
                  disabled={submitting || items.length === 0}
                  className="flex-[2] py-3.5 bg-g1 text-white border-none rounded-pill text-[0.95rem] font-extrabold cursor-pointer transition-all shadow-[0_4px_20px_rgba(45,90,0,.28)] hover:bg-g2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? '⏳ Memproses...' : '✅ Konfirmasi Pesanan'}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[0.73rem] text-muted justify-center mt-4">
                🔒 Pesanan akan dibuat dan keranjang akan dikosongkan
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 5: Selesai & Invoice ═══ */}
      {step === 5 && (
        <div className="max-w-[860px] mx-auto px-[6%] py-10 pb-20 animate-fadeInUp">
          <div className="flex flex-col items-center text-center py-10">
            <div className="text-[4rem] mb-4">🎉</div>
            <h3 className="font-lora text-[1.6rem] font-semibold mb-2.5">
              Pesanan Berhasil Dibuat!
            </h3>
            <div className="bg-g6 border border-g4 rounded-2xl px-6 py-4 mb-4 inline-block">
              <div className="text-[0.75rem] text-muted font-bold tracking-wider uppercase mb-1">
                Nomor Pesanan
              </div>
              <div className="text-[1.3rem] font-black text-g1 tracking-wide">
                {orderNumber}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl border border-faint p-5 mb-6 w-full max-w-[420px] text-left">
              <div className="flex justify-between text-[0.85rem] mb-1.5">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">
                  {formatRupiah(orderSubtotal)}
                </span>
              </div>
              {orderDiscount > 0 && (
                <div className="flex justify-between text-[0.85rem] mb-1.5 text-g3">
                  <span>Diskon</span>
                  <span>-{formatRupiah(orderDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold pt-2.5 border-t border-faint">
                <span>Total Bayar</span>
                <span className="text-g1">{formatRupiah(orderTotal)}</span>
              </div>
            </div>

            <p className="text-muted text-[0.88rem] leading-relaxed max-w-[440px] mx-auto mb-6">
              Silakan transfer sesuai jumlah di atas, lalu upload bukti
              pembayaran di halaman detail pesanan agar segera diproses.
            </p>

            <div className="flex gap-3 flex-wrap justify-center">
              <a
                href={`${API_BASE_URL}/orders/${orderId}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-ink border-[1.5px] border-faint py-3.5 px-7 rounded-pill text-[0.88rem] font-extrabold no-underline transition-all hover:border-g2 hover:text-g2"
              >
                📥 Unduh Invoice PDF
              </a>
              <button
                onClick={() => router.push(`/orders/${orderId}`)}
                className="bg-g1 text-white py-3.5 px-7 rounded-pill border-none text-[0.88rem] font-extrabold cursor-pointer transition-all hover:bg-g2 hover:-translate-y-0.5"
              >
                📋 Lihat Status Pesanan
              </button>
              <button
                onClick={() => router.push('/products')}
                className="bg-white text-ink border-[1.5px] border-faint py-3.5 px-7 rounded-pill text-[0.88rem] font-extrabold cursor-pointer transition-all hover:border-g2 hover:text-g2"
              >
                🛒 Lanjut Belanja
              </button>
            </div>
          </div>
        </div>
      )}
      </main>

      <Footer />
    </>
  );
}