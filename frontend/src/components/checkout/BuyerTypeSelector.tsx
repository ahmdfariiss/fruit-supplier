'use client';

interface BuyerTypeSelectorProps {
  value: 'consumer' | 'reseller';
  onChange: (type: 'consumer' | 'reseller') => void;
}

export default function BuyerTypeSelector({
  value,
  onChange,
}: BuyerTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Consumer */}
      <button
        type="button"
        onClick={() => onChange('consumer')}
        className={`
          relative p-5 rounded-2xl border-2 text-left transition-all duration-200
          ${
            value === 'consumer'
              ? 'border-g1 bg-g6 shadow-md'
              : 'border-faint bg-white hover:border-g4'
          }
        `}
      >
        {value === 'consumer' && (
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-g1 text-white text-xs flex items-center justify-center">
            ✓
          </div>
        )}
        <span className="text-2xl mb-2 block">🛒</span>
        <h4 className="font-bold text-sm text-ink mb-1">Konsumen</h4>
        <p className="text-xs text-muted leading-relaxed">
          Beli eceran untuk kebutuhan pribadi dengan harga normal
        </p>
      </button>

      {/* Reseller */}
      <button
        type="button"
        onClick={() => onChange('reseller')}
        className={`
          relative p-5 rounded-2xl border-2 text-left transition-all duration-200
          ${
            value === 'reseller'
              ? 'border-g1 bg-g6 shadow-md'
              : 'border-faint bg-white hover:border-g4'
          }
        `}
      >
        {value === 'reseller' && (
          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-g1 text-white text-xs flex items-center justify-center">
            ✓
          </div>
        )}
        <span className="text-2xl mb-2 block">🏪</span>
        <h4 className="font-bold text-sm text-ink mb-1">Reseller / Toko</h4>
        <p className="text-xs text-muted leading-relaxed">
          Beli grosir dengan harga khusus dan minimum order tertentu
        </p>
      </button>
    </div>
  );
}
