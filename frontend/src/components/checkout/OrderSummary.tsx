import { formatRupiah } from '@/lib/formatters';
import type { CartItem } from '@/store/cartStore';

interface OrderSummaryProps {
  items: CartItem[];
  buyerType: 'consumer' | 'reseller';
  discount?: number;
  shippingCost?: number;
}

export default function OrderSummary({
  items,
  buyerType,
  discount = 0,
  shippingCost = 0,
}: OrderSummaryProps) {
  const subtotal = items.reduce((sum, item) => {
    const price =
      buyerType === 'reseller'
        ? item.product.priceReseller
        : item.product.priceConsumer;
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal - discount + shippingCost;

  return (
    <div className="bg-white rounded-3xl border border-faint p-6">
      <h3 className="font-bold text-ink mb-4">Ringkasan Pesanan</h3>

      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const price =
            buyerType === 'reseller'
              ? item.product.priceReseller
              : item.product.priceConsumer;
          return (
            <div key={item.id} className="flex justify-between text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-muted">
                  {item.quantity} × {formatRupiah(price)}
                </p>
              </div>
              <span className="font-semibold text-ink ml-4">
                {formatRupiah(price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-faint pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold text-ink">
            {formatRupiah(subtotal)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-g3">Diskon Voucher</span>
            <span className="font-semibold text-g3">
              −{formatRupiah(discount)}
            </span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-muted">Ongkos Kirim</span>
          <span className="font-semibold text-ink">
            {shippingCost > 0 ? formatRupiah(shippingCost) : 'Gratis'}
          </span>
        </div>
        <div className="border-t border-faint pt-3 mt-3 flex justify-between">
          <span className="font-bold text-ink">Total</span>
          <span className="font-extrabold text-g1 text-lg">
            {formatRupiah(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
