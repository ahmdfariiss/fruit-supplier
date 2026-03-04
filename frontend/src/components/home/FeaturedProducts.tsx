
import type { Product } from '@/types/product';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

type FeaturedProductsProps = {
  products: Product[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products?.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-4 text-center text-muted py-8">Tidak ada produk unggulan.</div>
        )}
      </div>
    </section>
  );
}
