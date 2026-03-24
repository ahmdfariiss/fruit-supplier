import { AlertTriangleIcon, BankIcon } from '@/components/ui/icons';

interface PaymentInfoProps {
  orderNumber?: string;
}

export default function PaymentInfo({ orderNumber }: PaymentInfoProps) {
  return (
    <div className="space-y-6">
      <h3 className="font-bold text-ink text-lg">Informasi Pembayaran</h3>

      <div className="bg-g6 rounded-2xl p-6 border border-g5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">
            <BankIcon className="w-7 h-7 text-g1" />
          </span>
          <div>
            <p className="font-bold text-sm text-ink">Transfer Bank Manual</p>
            <p className="text-xs text-muted">
              Lakukan transfer ke rekening berikut
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-faint">
            <p className="text-xs text-muted font-semibold mb-1">Bank BCA</p>
            <p className="text-lg font-extrabold text-ink tracking-wider">
              1234 5678 9012
            </p>
            <p className="text-sm text-muted mt-1">
              a.n. PT BuahKita Indonesia
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-faint">
            <p className="text-xs text-muted font-semibold mb-1">
              Bank Mandiri
            </p>
            <p className="text-lg font-extrabold text-ink tracking-wider">
              1380 0123 4567 890
            </p>
            <p className="text-sm text-muted mt-1">
              a.n. PT BuahKita Indonesia
            </p>
          </div>
        </div>
      </div>

      {orderNumber && (
        <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
          <p className="text-sm font-bold text-yellow-800 mb-1 inline-flex items-center gap-1.5">
            <AlertTriangleIcon className="w-4 h-4" /> Penting
          </p>
          <p className="text-xs text-yellow-700 leading-relaxed">
            Sertakan nomor pesanan <strong>{orderNumber}</strong> sebagai
            berita/referensi transfer agar pembayaran dapat diverifikasi
            otomatis.
          </p>
        </div>
      )}
    </div>
  );
}
