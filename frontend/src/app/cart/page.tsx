'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { getImageUrl } from '@/lib/image';
import { useAuthStore } from '@/store/authStore';
import { formatRupiah } from '@/lib/formatters';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { useHydrated } from '@/hooks/useHydrated';
import { CartIcon, FruitIcon, LockIcon } from '@/components/ui/icons';

export default function CartPage() {
  const hydrated = useHydrated();
  const {
    items,
    isLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    totalPrice,
    buyerType,
    setBuyerType,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (hydrated && isAuthenticated) fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isAuthenticated]);

  // Show spinner while hydrating
  if (!hydrated) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 px-[6%] min-h-screen flex flex-col items-center justify-center">
          <LockIcon className="w-12 h-12 mb-4 text-muted" />
          <h2 className="text-xl font-bold text-ink mb-2">Login Diperlukan</h2>
          <p className="text-muted mb-6">
            Silakan login untuk melihat keranjang
          </p>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

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

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-[6%] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-lora text-3xl font-semibold text-ink mb-8">
            Keranjang Belanja
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <span className="block mb-4">
                <CartIcon className="w-12 h-12 mx-auto text-muted" />
              </span>
              <h3 className="text-lg font-bold text-ink mb-2">
                Keranjang Kosong
              </h3>
              <p className="text-muted mb-6">Ayo mulai belanja buah segar!</p>
              <Link href="/products">
                <Button>Lihat Produk</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              {/* Items */}
              <div className="space-y-4">
                {/* Buyer Type Toggle */}
                <div className="bg-white rounded-2xl border border-faint p-4 flex items-center gap-4">
                  <span className="text-sm font-bold text-ink">
                    Mode Harga:
                  </span>
                  <div className="flex bg-g6 rounded-full p-1">
                    <button
                      onClick={() => setBuyerType('CONSUMER')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        buyerType === 'CONSUMER'
                          ? 'bg-g1 text-white'
                          : 'text-muted'
                      }`}
                    >
                      Konsumen
                    </button>
                    <button
                      onClick={() => setBuyerType('RESELLER')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        buyerType === 'RESELLER'
                          ? 'bg-g1 text-white'
                          : 'text-muted'
                      }`}
                    >
                      Reseller
                    </button>
                  </div>
                </div>

                {items.map((item) => {
                  const price =
                    buyerType === 'RESELLER'
                      ? item.product.priceReseller
                      : item.product.priceConsumer;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-faint p-4 flex gap-4"
                    >
                      <div className="relative w-20 h-20 rounded-xl bg-g6 overflow-hidden flex-shrink-0">
                        {item.product.imageUrl ? (
                          <Image
                            src={getImageUrl(item.product.imageUrl)}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-2xl">
                            <FruitIcon className="w-8 h-8 text-g2" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-bold text-sm text-ink hover:text-g1 transition-colors no-underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-g1 font-extrabold text-sm mt-1">
                          {formatRupiah(price)}{' '}
                          <span className="text-muted font-normal text-xs">
                            /{item.product.unit}
                          </span>
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-faint rounded-full overflow-hidden">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-g6 text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-xs font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-g6 text-sm"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-500 font-bold hover:text-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-ink text-sm">
                          {formatRupiah(price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="lg:sticky lg:top-28">
                <div className="bg-white rounded-3xl border border-faint p-6">
                  <h3 className="font-bold text-ink mb-4">Ringkasan</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">
                        Total ({items.length} item)
                      </span>
                      <span className="font-bold text-ink">
                        {formatRupiah(totalPrice())}
                      </span>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button fullWidth size="lg">
                      Checkout — {formatRupiah(totalPrice())}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
