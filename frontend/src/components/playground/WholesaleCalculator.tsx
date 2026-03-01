'use client';

import { useState } from 'react';
import { formatRupiah } from '@/lib/formatters';

interface Product {
  id: string;
  name: string;
  priceConsumer: number;
  priceReseller: number;
  unit: string;
  minOrderReseller: number;
}

interface WholesaleCalculatorProps {
  products?: Product[];
}

export default function WholesaleCalculator({
  products = [],
}: WholesaleCalculatorProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const consumerTotal = selectedProduct
    ? selectedProduct.priceConsumer * quantity
    : 0;
  const resellerTotal = selectedProduct
    ? selectedProduct.priceReseller * quantity
    : 0;
  const savings = consumerTotal - resellerTotal;
  const meetsMinOrder = selectedProduct
    ? quantity >= selectedProduct.minOrderReseller
    : false;

  return (
    <div className="bg-white rounded-3xl border border-faint p-6">
      <h3 className="font-bold text-ink text-lg mb-1">
        🧮 Kalkulator Harga Grosir
      </h3>
      <p className="text-sm text-muted mb-6">
        Hitung estimasi penghematan dengan harga reseller
      </p>

      <div className="space-y-4">
        {/* Product Selector */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Pilih Produk
          </label>
          <select
            className="w-full px-4 py-3 rounded-2xl border border-faint bg-white text-sm
              focus:outline-none focus:border-g3 transition-colors appearance-none"
            value={selectedProduct?.id || ''}
            onChange={(e) => {
              const p = products.find((pr) => pr.id === e.target.value);
              setSelectedProduct(p || null);
              if (p) setQuantity(p.minOrderReseller);
            }}
          >
            <option value="">-- Pilih produk --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            Jumlah ({selectedProduct?.unit || 'unit'})
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-3 rounded-2xl border border-faint bg-white text-sm
              focus:outline-none focus:border-g3 transition-colors"
          />
          {selectedProduct && !meetsMinOrder && (
            <p className="text-xs text-orange-500 font-medium mt-1">
              Min. order reseller: {selectedProduct.minOrderReseller}{' '}
              {selectedProduct.unit}
            </p>
          )}
        </div>

        {/* Result */}
        {selectedProduct && (
          <div className="bg-g6 rounded-2xl p-5 border border-g5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Harga Konsumen</span>
              <span className="font-semibold text-ink">
                {formatRupiah(consumerTotal)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Harga Reseller</span>
              <span
                className={`font-semibold ${meetsMinOrder ? 'text-g1' : 'text-muted'}`}
              >
                {meetsMinOrder
                  ? formatRupiah(resellerTotal)
                  : 'Min. order belum terpenuhi'}
              </span>
            </div>
            {meetsMinOrder && savings > 0 && (
              <div className="border-t border-g5 pt-3 flex justify-between">
                <span className="font-bold text-g1">💰 Hemat</span>
                <span className="font-extrabold text-g1 text-lg">
                  {formatRupiah(savings)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
