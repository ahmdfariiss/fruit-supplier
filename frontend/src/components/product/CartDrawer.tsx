'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { formatRupiah } from '@/lib/formatters';
import { CartIcon, CloseIcon, FruitIcon } from '@/components/ui/icons';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const {
    items,
    isLoading,
    fetchCart,
    removeItem,
    updateQuantity,
    totalPrice,
    buyerType,
  } = useCartStore();

  useEffect(() => {
    if (open) {
      fetchCart();
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, fetchCart]);

  const total = totalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[990] bg-ink/40 backdrop-blur-[6px] transition-opacity duration-300 ${
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[995] w-[400px] max-w-full bg-white p-7 overflow-y-auto shadow-[-8px_0_48px_rgba(15,26,6,.12)] transition-transform duration-[400ms] ease-[cubic-bezier(.34,1.1,.64,1)] ${
          open ? 'translate-x-0' : 'translate-x-[110%]'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-7">
          <h3 className="font-lora text-[1.4rem] font-semibold">
            Keranjang Belanja
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border-none bg-g6 cursor-pointer text-base flex items-center justify-center hover:bg-g5 transition-colors"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        {isLoading ? (
          <div className="text-center py-16 text-muted">
            <CartIcon className="animate-spin inline-block w-8 h-8 mx-auto" />
            <p className="text-sm mt-2">Memuat keranjang...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <span className="block mb-3">
              <CartIcon className="w-12 h-12 mx-auto" />
            </span>
            <p className="text-[0.9rem] font-semibold">Keranjangmu kosong</p>
            <small className="text-muted">Yuk pilih buah segar!</small>
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {items.map((item) => {
                const price =
                  buyerType === 'RESELLER' &&
                  item.quantity >= item.product.minOrderReseller
                    ? Number(item.product.priceReseller)
                    : Number(item.product.priceConsumer);
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center py-3.5 border-b border-[#f5f5f5]"
                  >
                    <div className="w-[52px] h-[52px] rounded-[14px] bg-g6 flex items-center justify-center text-[2rem] flex-shrink-0">
                      <FruitIcon className="w-8 h-8 text-g2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <strong className="block text-[0.88rem] font-extrabold mb-[2px] truncate">
                        {item.product.name}
                      </strong>
                      <span className="text-[0.78rem] text-muted">
                        {item.quantity} {item.product.unit} ×{' '}
                        {formatRupiah(price)}
                      </span>
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 mt-1.5">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQuantity(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          className="w-6 h-6 rounded-full bg-g6 border-none text-sm font-bold text-ink flex items-center justify-center cursor-pointer hover:bg-g5"
                        >
                          −
                        </button>
                        <span className="text-xs font-extrabold w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 rounded-full bg-g6 border-none text-sm font-bold text-ink flex items-center justify-center cursor-pointer hover:bg-g5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="font-black text-g1 text-[0.9rem] flex-shrink-0">
                      {formatRupiah(price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pt-5">
              <div className="flex justify-between text-base font-extrabold py-3 border-t-2 border-faint">
                <span>Total Belanja</span>
                <span className="text-g1">{formatRupiah(total)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full bg-g1 text-white border-none py-4 rounded-pill text-[0.95rem] font-extrabold text-center no-underline font-sans mt-3.5 transition-all duration-200 hover:bg-g2 hover:-translate-y-[2px] hover:shadow-[0_6px_24px_rgba(45,90,0,.3)]"
              >
                Lanjut ke Pembayaran →
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
