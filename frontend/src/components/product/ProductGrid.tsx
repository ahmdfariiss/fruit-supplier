'use client';

import type { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  showResellerPrice?: boolean;
  emptyMessage?: string;
  onOpenDetail?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  isLoading = false,
  showResellerPrice = false,
  emptyMessage = 'Produk tidak ditemukan',
  onOpenDetail,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-[22px] border border-faint overflow-hidden animate-pulse"
          >
            <div className="bg-g5 min-h-[160px]" />
            <div className="p-5 space-y-2">
              <div className="h-3 bg-g6 rounded-full w-1/3" />
              <div className="h-4 bg-g6 rounded-full w-2/3" />
              <div className="h-3 bg-g6 rounded-full w-full" />
              <div className="h-5 bg-g6 rounded-full w-1/2 mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted col-span-full">
        <span className="text-[3.5rem] block mb-3">🔍</span>
        <h3 className="font-lora text-xl mb-2 text-ink">{emptyMessage}</h3>
        <p className="text-[0.85rem] leading-relaxed">
          Coba ubah filter atau kata kunci pencarian kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          showResellerPrice={showResellerPrice}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}
