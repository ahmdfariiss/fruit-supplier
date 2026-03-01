'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Button from '@/components/ui/Button';

interface VoucherInputProps {
  onApply: (discount: number, code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  orderTotal: number;
}

export default function VoucherInput({
  onApply,
  onRemove,
  appliedCode,
  orderTotal,
}: VoucherInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/vouchers/validate', {
        code: code.trim(),
        orderTotal,
      });
      onApply(data.data.discountAmount, code.trim());
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || 'Voucher tidak valid');
    } finally {
      setIsLoading(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center gap-3 bg-g6 rounded-2xl p-4 border border-g4">
        <span className="text-lg">🎟️</span>
        <div className="flex-1">
          <p className="text-sm font-bold text-g1">{appliedCode}</p>
          <p className="text-xs text-muted">Voucher berhasil diterapkan</p>
        </div>
        <button
          onClick={onRemove}
          className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
        >
          Hapus
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Masukkan kode voucher"
          className="flex-1 px-4 py-3 rounded-2xl border border-faint bg-white text-sm
            focus:outline-none focus:border-g3 transition-colors uppercase tracking-wider font-bold"
        />
        <Button
          variant="secondary"
          onClick={handleApply}
          isLoading={isLoading}
          disabled={!code.trim()}
        >
          Terapkan
        </Button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
