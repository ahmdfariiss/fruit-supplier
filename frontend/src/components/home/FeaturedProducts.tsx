'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get('/products?featured=true&limit=8');
      return data.data as Product[];
    },
  });

  return (
    <section className="py-[90px] px-[6%]">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="sec-ey">Pilihan Terbaik</div>
          <h2 className="sec-title">
            Buah <em>Unggulan</em>
          </h2>
        </div>
        <Link
          href="/products"
          className="bg-transparent text-ink py-2 px-5 rounded-pill font-bold text-[0.82rem] no-underline border-[1.5px] border-faint transition-all duration-200 hover:border-g2 hover:text-g2"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Products */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-faint overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-g6" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-g6 rounded-full w-1/3" />
                <div className="h-4 bg-g6 rounded-full w-2/3" />
                <div className="h-5 bg-g6 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
