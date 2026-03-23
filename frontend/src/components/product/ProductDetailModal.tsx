'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types/product';
import { formatRupiah } from '@/lib/formatters';
import { getImageUrl } from '@/lib/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import StarRating from '@/components/ui/StarRating';
import {
  CartIcon,
  CheckCircleIcon,
  CloseIcon,
  FruitIcon,
  LeafIcon,
  MapPinIcon,
  StoreIcon,
} from '@/components/ui/icons';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  buyerMode: 'consumer' | 'reseller';
}

export default function ProductDetailModal({
  product,
  onClose,
  buyerMode,
}: ProductDetailModalProps) {
  const [qty, setQty] = useState(1);
  const [priceMode, setPriceMode] = useState(buyerMode);
  const addToCart = useCartStore((s) => s.addToCart);
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();

  if (!product) return null;

  const price =
    priceMode === 'reseller' ? product.priceReseller : product.priceConsumer;
  const savePct = Math.round((1 - price / (product.priceConsumer * 1.2)) * 100);

  const handleAdd = async () => {
    if (!user) {
      toast('Silakan login terlebih dahulu', 'warning');
      return;
    }
    try {
      await addToCart(product.id, qty);
      toast(`${product.name} ×${qty} ditambahkan ke keranjang!`, 'success');
      onClose();
    } catch {
      toast('Gagal menambahkan ke keranjang', 'error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998] bg-ink/45 backdrop-blur-[8px] flex items-center justify-center p-5"
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail produk: ${product.name}`}
      >
        {/* Modal */}
        <div className="bg-white rounded-[28px] w-full max-w-[900px] max-h-[90vh] overflow-y-auto shadow-[0_24px_80px_rgba(15,26,6,.2)] animate-[modalIn_0.35s_cubic-bezier(.34,1.1,.64,1)] relative">
          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Tutup detail produk"
            className="absolute top-5 right-5 z-[2] w-[38px] h-[38px] rounded-full bg-ink/[.07] border-none cursor-pointer text-base flex items-center justify-center hover:bg-ink/[.12] transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            {/* Visual Left */}
            <div className="bg-g5 rounded-t-[28px] md:rounded-l-[28px] md:rounded-tr-none flex flex-col items-center justify-center p-12 relative overflow-hidden gap-5">
              <div className="absolute -bottom-[60px] -right-[60px] w-[250px] h-[250px] rounded-full bg-g4/25" />
              {product.imageUrl ? (
                <div className="relative w-[200px] h-[200px] z-[1] animate-[bob_3s_ease-in-out_infinite]">
                  <Image
                    src={getImageUrl(product.imageUrl)}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <FruitIcon className="text-g2 w-28 h-28 relative z-[1] animate-[bob_3s_ease-in-out_infinite]" />
              )}
              {/* Farm card */}
              <div className="bg-white rounded-2xl p-3.5 px-[18px] w-full border border-g4/40 relative z-[1]">
                <div className="text-[0.68rem] font-extrabold text-g2 tracking-[0.07em] uppercase mb-1.5 inline-flex items-center gap-1.5">
                  <LeafIcon className="w-3.5 h-3.5" /> Dari Kebun
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-g5 flex items-center justify-center text-lg">
                    <LeafIcon className="w-4.5 h-4.5 text-g1" />
                  </div>
                  <div>
                    <strong className="block text-[0.85rem] font-extrabold">
                      Petani Mitra
                    </strong>
                    <span className="text-[0.75rem] text-muted inline-flex items-center gap-1">
                      <MapPinIcon className="w-3.5 h-3.5" /> Indonesia
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Right */}
            <div className="p-10 flex flex-col gap-0">
              {/* Badges */}
              <div className="flex gap-1.5 mb-3.5 flex-wrap">
                {product.category && (
                  <span className="text-[0.65rem] font-extrabold px-2.5 py-1 rounded-pill uppercase tracking-wide bg-g5 text-g1">
                    {product.category.name}
                  </span>
                )}
                <span className="text-[0.65rem] font-extrabold px-2.5 py-1 rounded-pill uppercase tracking-wide bg-[#e8f5e9] text-[#2e7d32]">
                  <span className="inline-flex items-center gap-1">
                    <CheckCircleIcon className="w-3.5 h-3.5" /> Segar Hari Ini
                  </span>
                </span>
              </div>

              {/* Name */}
              <h2 className="font-lora text-[1.8rem] font-semibold leading-tight mb-1.5 tracking-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-5">
                <StarRating rating={product.avgRating || 4.5} size="sm" />
                <span className="text-[0.8rem] text-muted">
                  {product.avgRating?.toFixed(1) || '4.5'} ·{' '}
                  {product.reviewCount || 0} ulasan
                </span>
              </div>

              {/* Description */}
              <p className="text-[0.88rem] text-muted leading-[1.75] mb-6 pb-6 border-b border-faint">
                {product.description ||
                  'Buah segar berkualitas tinggi langsung dari petani mitra kami. Dipanen dengan hati-hati untuk menjaga kualitas terbaik.'}
              </p>

              {/* Specs grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-g6 rounded-xl p-2.5 px-3.5">
                  <span className="block text-[0.68rem] font-extrabold text-muted tracking-wide uppercase mb-[2px]">
                    Stok
                  </span>
                  <strong className="text-[0.85rem] font-bold text-ink">
                    {product.stock} {product.unit}
                  </strong>
                </div>
                <div className="bg-g6 rounded-xl p-2.5 px-3.5">
                  <span className="block text-[0.68rem] font-extrabold text-muted tracking-wide uppercase mb-[2px]">
                    Unit
                  </span>
                  <strong className="text-[0.85rem] font-bold text-ink">
                    {product.unit}
                  </strong>
                </div>
                {product.seasonStart && (
                  <div className="bg-g6 rounded-xl p-2.5 px-3.5">
                    <span className="block text-[0.68rem] font-extrabold text-muted tracking-wide uppercase mb-[2px]">
                      Musim
                    </span>
                    <strong className="text-[0.85rem] font-bold text-ink">
                      Bln {product.seasonStart}–{product.seasonEnd}
                    </strong>
                  </div>
                )}
                <div className="bg-g6 rounded-xl p-2.5 px-3.5">
                  <span className="block text-[0.68rem] font-extrabold text-muted tracking-wide uppercase mb-[2px]">
                    Min. Reseller
                  </span>
                  <strong className="text-[0.85rem] font-bold text-ink">
                    {product.minOrderReseller} {product.unit}
                  </strong>
                </div>
              </div>

              {/* Price section */}
              <div className="bg-g6 rounded-2xl p-[18px] px-5 mb-5 border border-faint">
                {/* Mode tabs */}
                <div className="flex gap-1.5 mb-3.5">
                  <button
                    onClick={() => setPriceMode('consumer')}
                    className={`px-4 py-1.5 rounded-pill text-[0.78rem] font-bold border-[1.5px] font-sans transition-all ${
                      priceMode === 'consumer'
                        ? 'bg-g1 text-white border-g1'
                        : 'bg-white text-muted border-faint'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <CartIcon className="w-3.5 h-3.5" /> Konsumen
                    </span>
                  </button>
                  <button
                    onClick={() => setPriceMode('reseller')}
                    className={`px-4 py-1.5 rounded-pill text-[0.78rem] font-bold border-[1.5px] font-sans transition-all ${
                      priceMode === 'reseller'
                        ? 'bg-g1 text-white border-g1'
                        : 'bg-white text-muted border-faint'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <StoreIcon className="w-3.5 h-3.5" /> Reseller
                    </span>
                  </button>
                </div>
                <div className="flex items-end gap-2.5">
                  <span className="text-[2rem] font-black text-g1 tracking-tight leading-none">
                    {formatRupiah(price)}
                  </span>
                  <span className="text-[0.85rem] text-muted mb-1">
                    /{product.unit}
                  </span>
                  <span className="text-[0.82rem] text-muted line-through">
                    {formatRupiah(product.priceConsumer * 1.2)}
                  </span>
                  {savePct > 0 && (
                    <span className="text-[0.72rem] font-extrabold bg-[#e8f5e9] text-[#2e7d32] px-2 py-[3px] rounded-pill ml-auto self-start">
                      Hemat {savePct}%
                    </span>
                  )}
                </div>
                {priceMode === 'reseller' && (
                  <div className="text-[0.75rem] text-muted mt-1.5">
                    Min. order: {product.minOrderReseller} {product.unit}
                  </div>
                )}
              </div>

              {/* Qty + Add */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border-[1.5px] border-faint rounded-pill overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    aria-label="Kurangi jumlah"
                    className="w-9 h-9 border-none bg-transparent cursor-pointer text-lg font-bold text-g1 flex items-center justify-center hover:bg-g6 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    aria-label="Jumlah produk"
                    onChange={(e) =>
                      setQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    min={1}
                    max={99}
                    className="w-9 text-center text-[0.9rem] font-extrabold border-none outline-none font-sans"
                  />
                  <button
                    onClick={() => setQty(Math.min(99, qty + 1))}
                    aria-label="Tambah jumlah"
                    className="w-9 h-9 border-none bg-transparent cursor-pointer text-lg font-bold text-g1 flex items-center justify-center hover:bg-g6 transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-g1 text-white border-none py-3 px-6 rounded-pill text-[0.9rem] font-extrabold cursor-pointer font-sans transition-all duration-250 flex items-center justify-center gap-2 hover:bg-g2 hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(45,90,0,.3)]"
                >
                  <CartIcon className="w-4 h-4" /> Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
}
