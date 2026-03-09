'use client';

import Image from 'next/image';
import type { Product } from '@/types/product';
import { formatRupiah } from '@/lib/formatters';
import { getImageUrl } from '@/lib/image';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';

interface ProductCardProps {
  product: Product;
  showResellerPrice?: boolean;
  onOpenDetail?: (product: Product) => void;
  priority?: boolean;
}

export default function ProductCard({
  product,
  showResellerPrice = false,
  onOpenDetail,
  priority = false,
}: ProductCardProps) {
  const displayPrice = showResellerPrice
    ? product.priceReseller
    : product.priceConsumer;
  const addToCart = useCartStore((s) => s.addToCart);
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();

  const stockPct = Math.min(100, Math.round((product.stock / 100) * 100));

  const badge = product.isFeatured
    ? { label: 'Unggulan', cls: 'bg-g1 text-white' }
    : product.tags?.includes('Promo')
      ? { label: 'Promo', cls: 'bg-purple-600 text-white' }
      : product.tags?.includes('Baru')
        ? { label: 'Baru', cls: 'bg-blue-500 text-white' }
        : null;

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast('Silakan login terlebih dahulu', 'warning');
      return;
    }
    try {
      await addToCart(product.id, 1);
      toast(`${product.name} ditambahkan ke keranjang!`, 'success');
    } catch {
      toast('Gagal menambahkan ke keranjang', 'error');
    }
  };

  return (
    <div
      className="group bg-white rounded-[22px] overflow-hidden border border-faint cursor-pointer relative transition-[transform,box-shadow] duration-300 hover:-translate-y-[5px] hover:shadow-[0_16px_44px_rgba(45,90,0,.12)]"
      onClick={() => onOpenDetail?.(product)}
    >
      {/* Badge */}
      {badge && (
        <span
          className={`absolute top-3 left-3 z-10 text-[0.6rem] font-extrabold px-2.5 py-1 rounded-pill uppercase tracking-wide ${badge.cls}`}
        >
          {badge.label}
        </span>
      )}

      {/* Image */}
      <div className="bg-g5 flex items-center justify-center text-[4.5rem] transition-transform duration-400 relative overflow-hidden group-hover:scale-105 aspect-[4/3]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(45,90,0,.06)]" />
        {product.imageUrl ? (
          <Image
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-[350ms] ease-[cubic-bezier(.34,1.5,.64,1)] group-hover:scale-[1.15] group-hover:-rotate-[8deg]"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
          />
        ) : (
          <span className="relative z-[1] transition-transform duration-[350ms] ease-[cubic-bezier(.34,1.5,.64,1)] group-hover:scale-[1.15] group-hover:-rotate-[8deg]">
            🍊
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 pt-[18px] pb-5">
        {/* Origin */}
        <div className="text-[0.68rem] font-bold text-g2 uppercase tracking-wide flex items-center gap-1 mb-[5px]">
          📍 {product.category?.name || 'Buah Segar'}
        </div>

        {/* Name */}
        <h3 className="font-lora text-base font-semibold leading-tight mb-[5px]">
          {product.name}
        </h3>

        {/* Desc */}
        <p className="text-[0.78rem] text-muted leading-relaxed mb-3 line-clamp-2">
          {product.description?.substring(0, 80) ||
            'Buah segar berkualitas tinggi langsung dari petani.'}
          ...
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[#f0a500] text-[0.8rem] tracking-wider">
            ★★★★★
          </span>
          <span className="text-[0.78rem] text-muted">
            {product.avgRating?.toFixed(1) || '4.5'} ({product.reviewCount || 0}
            )
          </span>
        </div>

        {/* Stock bar */}
        <div className="h-[3px] bg-faint rounded-[10px] overflow-hidden">
          <div
            className="h-full rounded-[10px] bg-gradient-to-r from-g3 to-g4"
            style={{ width: `${stockPct}%` }}
          />
        </div>
        <div className="text-[0.67rem] text-muted font-semibold mt-1">
          {product.stock < 20 ? '⚠️ Stok terbatas' : '✅ Stok tersedia'} ·{' '}
          {stockPct}%
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div>
            {showResellerPrice &&
              product.priceReseller < product.priceConsumer && (
                <span className="text-[0.72rem] text-muted line-through block">
                  {formatRupiah(product.priceConsumer)}
                </span>
              )}
            <span
              className={`text-base font-black ${showResellerPrice ? 'text-[#c47d00]' : 'text-g1'}`}
            >
              {formatRupiah(displayPrice)}
              <span className="text-[0.72rem] font-medium text-muted">
                /{product.unit}
              </span>
            </span>
            {showResellerPrice && (
              <span className="block text-[0.68rem] text-muted">
                Min. {product.minOrderReseller} {product.unit}
              </span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label={`Tambahkan ${product.name} ke keranjang`}
            className="w-[38px] h-[38px] rounded-full bg-g1 text-white border-none text-xl flex items-center justify-center transition-all duration-250 hover:bg-g3 hover:scale-[1.12] hover:rotate-90 flex-shrink-0"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
