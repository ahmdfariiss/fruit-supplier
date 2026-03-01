import Button from '@/components/ui/Button';
import Link from 'next/link';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  voucherCode?: string | null;
  onRetry: () => void;
}

export default function QuizResult({
  score,
  totalQuestions,
  voucherCode,
  onRetry,
}: QuizResultProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPerfect = score === totalQuestions;

  return (
    <div className="bg-white rounded-3xl border border-faint p-8 max-w-md mx-auto text-center">
      {/* Score Display */}
      <div className="mb-6">
        <div className="w-28 h-28 rounded-full bg-g6 flex items-center justify-center mx-auto mb-4 border-4 border-g4">
          <span className="text-3xl font-extrabold text-g1">{percentage}%</span>
        </div>
        <h3 className="text-xl font-bold text-ink mb-1">
          {isPerfect
            ? '🎉 Sempurna!'
            : percentage >= 70
              ? '👏 Bagus!'
              : '💪 Coba Lagi!'}
        </h3>
        <p className="text-sm text-muted">
          Kamu menjawab benar {score} dari {totalQuestions} soal
        </p>
      </div>

      {/* Voucher Reward */}
      {isPerfect && voucherCode && (
        <div className="bg-g6 rounded-2xl p-5 border border-g4 mb-6">
          <p className="text-sm font-bold text-g1 mb-2">
            🎟️ Selamat! Kamu mendapat voucher:
          </p>
          <div className="bg-white rounded-xl py-3 px-4 border border-g4">
            <p className="font-extrabold text-lg text-g1 tracking-widest">
              {voucherCode}
            </p>
          </div>
          <p className="text-xs text-muted mt-2">
            Gunakan voucher ini saat checkout untuk mendapat diskon!
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button variant="ghost" onClick={onRetry} fullWidth>
          Coba Lagi
        </Button>
        <Link href="/products">
          <Button fullWidth>Mulai Belanja</Button>
        </Link>
      </div>
    </div>
  );
}
