'use client';

import { useState, Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilter from '@/components/product/ProductFilter';
import Pagination from '@/components/ui/Pagination';
import type { Category, Product } from '@/types/product';

const ProductDetailModal = lazy(() => import('@/components/product/ProductDetailModal'));
const CartDrawer = lazy(() => import('@/components/product/CartDrawer'));

function ProductsContent() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [buyerMode, setBuyerMode] = useState<'consumer' | 'reseller'>(
    'consumer',
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    sort:
      (searchParams.get('sort') as
        | 'newest'
        | 'price_asc'
        | 'price_desc'
        | 'popular') || undefined,
    buyerType: buyerMode === 'reseller' ? ('reseller' as const) : undefined,
    tags: searchParams.get('tags') || undefined,
    seasonMonth: searchParams.get('seasonMonth')
      ? Number(searchParams.get('seasonMonth'))
      : undefined,
    minPrice: searchParams.get('minPrice')
      ? Number(searchParams.get('minPrice'))
      : undefined,
    maxPrice: searchParams.get('maxPrice')
      ? Number(searchParams.get('maxPrice'))
      : undefined,
    page,
    limit: 12,
  };

  const { data, isLoading } = useProducts(filters);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data as Category[];
    },
  });

  return (
    <>
      {/* Page Header */}
      <div className="pt-[120px] pb-[60px] px-[6%] bg-g6 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -right-[100px] -top-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,207,111,.2)_0%,transparent_65%)] pointer-events-none" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-muted mb-5">
          <a
            href="/"
            className="text-muted no-underline hover:text-g2 transition-colors"
          >
            Beranda
          </a>
          <span className="text-faint">›</span>
          <span>Katalog Produk</span>
        </div>

        <h1 className="font-lora text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-tight leading-[1.15] mb-3">
          Katalog <em className="italic text-g2">Buah Segar</em>
        </h1>
        <p className="text-[0.95rem] text-muted max-w-[460px] leading-relaxed">
          Semua buah langsung dari petani mitra kami. Segar dipanen, cepat
          dikirim, harga transparan.
        </p>

        {/* Mode Toggle */}
        <div className="inline-flex bg-white border border-faint rounded-pill p-1 gap-1 mt-7 shadow-[0_2px_12px_rgba(45,90,0,.07)]">
          <button
            onClick={() => setBuyerMode('consumer')}
            className={`py-2.5 px-6 rounded-pill text-[0.85rem] font-bold border-none cursor-pointer font-sans transition-all duration-250 ${
              buyerMode === 'consumer'
                ? 'bg-g1 text-white shadow-[0_2px_10px_rgba(45,90,0,.3)]'
                : 'bg-transparent text-muted'
            }`}
          >
            🛒 Konsumen
          </button>
          <button
            onClick={() => setBuyerMode('reseller')}
            className={`py-2.5 px-6 rounded-pill text-[0.85rem] font-bold border-none cursor-pointer font-sans transition-all duration-250 ${
              buyerMode === 'reseller'
                ? 'bg-g1 text-white shadow-[0_2px_10px_rgba(45,90,0,.3)]'
                : 'bg-transparent text-muted'
            }`}
          >
            🏪 Reseller / Toko
          </button>
        </div>

        {/* Reseller notice */}
        {buyerMode === 'reseller' && (
          <div className="mt-3.5 bg-white border border-g4 rounded-[14px] px-[18px] py-3 text-[0.82rem] text-muted max-w-[500px] flex items-center gap-2">
            💼{' '}
            <span>
              Menampilkan <b className="text-g1">harga grosir reseller</b>.
              Harga berlaku untuk pembelian minimum sesuai ketentuan.
            </span>
          </div>
        )}
      </div>

      {/* Katalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 px-[6%] py-12 items-start">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block sticky top-[90px]">
          <ProductFilter categories={categories || []} />
        </aside>

        {/* Main Grid */}
        <section>
          {/* Grid top bar */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="text-[0.85rem] text-muted font-semibold">
              Menampilkan{' '}
              <b className="text-ink">{data?.pagination?.totalItems || 0}</b>{' '}
              produk
            </div>
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-faint rounded-xl text-[0.82rem] font-bold text-muted hover:border-g3 hover:text-g1 transition-all"
            >
              <span>🔍</span> Filter & Urutkan
            </button>
          </div>

          <ProductGrid
            products={data?.data || []}
            isLoading={isLoading}
            showResellerPrice={buyerMode === 'reseller'}
            onOpenDetail={(p) => setSelectedProduct(p)}
          />

          {data?.pagination && data.pagination.totalPages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </section>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[340px] bg-white overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="sticky top-0 bg-white border-b border-faint px-5 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-ink text-base">Filter & Urutkan</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-g6 transition-colors text-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <ProductFilter categories={categories || []} />
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            buyerMode={buyerMode}
          />
        </Suspense>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <Suspense fallback={null}>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        <Suspense
          fallback={
            <div className="pt-[120px] pb-20 px-[6%] bg-g6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-g5 rounded-full w-1/3" />
                <div className="h-4 bg-g5 rounded-full w-1/2" />
              </div>
            </div>
          }
        >
          <ProductsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
