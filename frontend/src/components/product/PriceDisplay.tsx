import { formatRupiah } from '@/lib/formatters';

interface PriceDisplayProps {
  consumerPrice: number;
  resellerPrice: number;
  unit: string;
  showBoth?: boolean;
  activeType?: 'consumer' | 'reseller';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: { price: 'text-sm', unit: 'text-xs' },
  md: { price: 'text-lg', unit: 'text-sm' },
  lg: { price: 'text-2xl', unit: 'text-base' },
};

export default function PriceDisplay({
  consumerPrice,
  resellerPrice,
  unit,
  showBoth = false,
  activeType = 'consumer',
  size = 'md',
}: PriceDisplayProps) {
  const activePrice = activeType === 'reseller' ? resellerPrice : consumerPrice;
  const s = sizeClasses[size];

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={`text-g1 font-extrabold ${s.price}`}>
          {formatRupiah(activePrice)}
        </span>
        <span className={`text-muted ${s.unit}`}>/{unit}</span>
      </div>
      {showBoth && activeType === 'reseller' && (
        <p className="text-xs text-muted line-through mt-0.5">
          {formatRupiah(consumerPrice)}
        </p>
      )}
      {showBoth &&
        activeType === 'consumer' &&
        resellerPrice < consumerPrice && (
          <p className="text-xs text-g3 font-semibold mt-0.5">
            Harga reseller: {formatRupiah(resellerPrice)}/{unit}
          </p>
        )}
    </div>
  );
}
