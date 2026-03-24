'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';
import {
  formatRupiah,
  getJakartaCurrentDate,
  getJakartaCurrentMonth,
  getJakartaCurrentYear,
} from '@/lib/formatters';
import type { Product } from '@/types/product';
import type { QuizQuestion, QuizResult } from '@/types/quiz';

/* ════════════════════════════
   CONSTANTS
   ════════════════════════════ */
const MONTHS_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];
const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const tabs = [
  { id: 'kalender' as const, label: '📅 Kalender Musim' },
  { id: 'quiz' as const, label: '🧠 Quiz Buah' },
  { id: 'kalkulator' as const, label: '🧮 Kalkulator Grosir' },
];

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<
    'kalender' | 'quiz' | 'kalkulator'
  >('kalender');
  const { toast } = useToast();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="min-h-[60vh] bg-g6 flex flex-col items-center justify-center text-center px-[6%] pt-[140px] pb-[60px] relative overflow-hidden">
          <div className="absolute -right-[180px] -top-[180px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,207,111,.25)_0%,transparent_65%)] pointer-events-none" />
          <div className="absolute -bottom-[120px] -left-[120px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(45,90,0,.08)_0%,transparent_65%)] pointer-events-none" />
          <div className="sec-ey justify-center">✦ FICPACT PLAYGROUND ✦</div>
          <h1 className="font-lora text-[clamp(2.2rem,5vw,3.8rem)] font-semibold leading-[1.1] tracking-tight mb-5">
            Eksplorasi{' '}
            <em className="italic bg-gradient-to-br from-g1 to-g3 bg-clip-text text-transparent">
              Dunia Buah
            </em>
            <br />
            dengan Cara Seru!
          </h1>
          <p className="text-[1.05rem] text-muted max-w-[560px] leading-[1.7]">
            Temukan musim panen terbaik, uji pengetahuanmu, dan hitung harga
            grosir — semuanya interaktif!
          </p>
        </section>

        {/* Tab Switcher */}
        <div className="flex gap-2.5 justify-center flex-wrap px-[6%] -mt-5 mb-10 relative z-[2]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-pill border-[1.5px] text-[0.88rem] font-bold transition-all duration-250 shadow-[0_2px_12px_rgba(45,90,0,.06)] ${
                activeTab === tab.id
                  ? 'bg-g1 text-white border-g1 shadow-[0_4px_18px_rgba(45,90,0,.35)]'
                  : 'bg-white text-muted border-faint hover:border-g3 hover:text-g1 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(45,90,0,.1)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="px-[6%] pb-20 max-w-[1200px] mx-auto">
          {activeTab === 'kalender' && <CalendarPanel />}
          {activeTab === 'quiz' && <QuizPanel toast={toast} />}
          {activeTab === 'kalkulator' && <CalculatorPanel toast={toast} />}
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ════════════════════════════════════════════
   PANEL 1: KALENDER MUSIM BUAH (API)
   ════════════════════════════════════════════ */
function CalendarPanel() {
  const currentJakartaYear = getJakartaCurrentYear();
  const currentJakartaMonthIndex = getJakartaCurrentMonth() - 1;
  const currentJakartaDate = getJakartaCurrentDate();

  const [year, setYear] = useState(currentJakartaYear);
  const [month, setMonth] = useState(currentJakartaMonthIndex);
  const [filter, setFilter] = useState('all');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const router = useRouter();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products-season'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=50');
      return data.data as Product[];
    },
  });

  const changeMonth = useCallback((d: number) => {
    setSelectedDay(null);
    setMonth((prev) => {
      const m = prev + d;
      if (m < 0) {
        setYear((y) => y - 1);
        return 11;
      }
      if (m > 11) {
        setYear((y) => y + 1);
        return 0;
      }
      return m;
    });
  }, []);

  const getSeasonStatus = (
    product: Product,
    monthIdx: number,
  ): 'P' | 'A' | 'O' => {
    if (product.seasonStart === null || product.seasonEnd === null) return 'A';
    const m = monthIdx + 1;
    const start = product.seasonStart;
    const end = product.seasonEnd;
    if (start <= end) {
      if (m >= start && m <= end) return 'P';
      if (m === start - 1 || m === end + 1) return 'A';
      return 'O';
    } else {
      if (m >= start || m <= end) return 'P';
      if (m === ((start - 2 + 12) % 12) + 1 || m === (end % 12) + 1) return 'A';
      return 'O';
    }
  };

  const allProducts = products || [];
  const filteredProducts =
    filter === 'all'
      ? allProducts
      : [allProducts[parseInt(filter)]].filter(Boolean);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrentMonth =
    currentJakartaYear === year && currentJakartaMonthIndex === month;

  const peakFruits = filteredProducts.filter(
    (p) => getSeasonStatus(p, month) === 'P',
  );
  const availFruits = filteredProducts.filter(
    (p) => getSeasonStatus(p, month) === 'A',
  );
  const offFruits = filteredProducts.filter(
    (p) => getSeasonStatus(p, month) === 'O',
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 text-center">
        <div className="animate-spin text-4xl mx-auto mb-4">🍊</div>
        <p className="text-muted">Memuat data musim buah...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30">
      <div className="flex items-center justify-between flex-wrap gap-3.5 mb-7">
        <h3 className="font-lora text-2xl font-semibold">
          📅 Kalender Musim Buah
        </h3>
        <div className="flex items-center gap-2.5 flex-wrap">
          <label className="text-[0.76rem] font-extrabold uppercase tracking-[0.06em] text-muted">
            Filter Buah:
          </label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setSelectedDay(null);
            }}
            className="px-3.5 py-[9px] border-[1.5px] border-faint rounded-xl text-[0.88rem] font-semibold bg-white outline-none transition-colors focus:border-g3"
          >
            <option value="all">🍇 Semua Buah</option>
            {allProducts.map((p, i) => (
              <option key={p.id} value={i}>
                {p.category?.icon || '🍊'} {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-5">
        <button
          onClick={() => changeMonth(-1)}
          className="w-[38px] h-[38px] rounded-full border-[1.5px] border-faint bg-white flex items-center justify-center text-base hover:border-g3 hover:bg-g6 transition-all hover:scale-105"
        >
          ‹
        </button>
        <span className="text-[1.05rem] font-extrabold min-w-[160px] text-center">
          {MONTHS_ID[month]} {year}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="w-[38px] h-[38px] rounded-full border-[1.5px] border-faint bg-white flex items-center justify-center text-base hover:border-g3 hover:bg-g6 transition-all hover:scale-105"
        >
          ›
        </button>
      </div>

      <div className="flex gap-3.5 text-[0.76rem] font-bold text-muted mb-5 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-g2" /> Puncak Panen
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-g4" /> Tersedia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sand" /> Tidak Musim
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-g3 shadow-[0_0_0_2px_var(--g5)]" />{' '}
          Hari Ini
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS_ID.map((d) => (
          <div
            key={d}
            className="text-[0.7rem] font-extrabold uppercase tracking-[0.06em] text-muted text-center py-2"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e${i}`} className="aspect-square" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasPeak = peakFruits.length > 0;
          const hasAvail = availFruits.length > 0 && !hasPeak;
          const isToday = isCurrentMonth && day === currentJakartaDate;
          const showFruits = [...peakFruits, ...availFruits];
          const icons = showFruits
            .slice(0, 4)
            .map((f) => f.category?.icon || '🍊')
            .join('');
          const isSelected = selectedDay === day;

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`relative aspect-square rounded-[14px] flex flex-col items-center justify-center text-[0.88rem] font-semibold border-2 border-transparent transition-all duration-250 min-h-[60px] cursor-pointer
                ${hasPeak ? 'bg-g6 border-g4 hover:bg-g5 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,90,0,.12)]' : ''}
                ${hasAvail ? 'bg-[rgba(168,207,111,.1)] border-[rgba(168,207,111,.25)] hover:bg-[rgba(168,207,111,.2)] hover:-translate-y-0.5' : ''}
                ${isToday ? 'shadow-[0_0_0_3px_var(--g3)] z-[1]' : ''}
                ${isSelected ? 'shadow-[0_0_0_3px_var(--g2)] -translate-y-0.5 z-[2]' : ''}
              `}
            >
              <span
                className={`font-bold text-[0.9rem] leading-none mb-0.5 ${isToday ? 'text-g1 font-black' : ''}`}
              >
                {day}
              </span>
              {icons && (
                <span className="text-[0.65rem] leading-none">{icons}</span>
              )}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-5 p-5 px-6 bg-white border-2 border-g4 rounded-[18px] shadow-[0_4px_20px_rgba(45,90,0,.08)] animate-fadeInUp">
          <div className="flex items-center justify-between mb-4">
            <span className="font-lora text-[1.1rem] font-semibold">
              📅 {selectedDay} {MONTHS_ID[month]} {year}
            </span>
            <button
              onClick={() => setSelectedDay(null)}
              className="w-[30px] h-[30px] rounded-full border-[1.5px] border-faint bg-white flex items-center justify-center text-[0.9rem] hover:bg-g6 hover:border-g3 transition-all"
            >
              ✕
            </button>
          </div>
          {peakFruits.length > 0 && (
            <div className="mb-3.5">
              <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-muted mb-2 flex items-center gap-1.5">
                🟢 Puncak Panen
              </div>
              <div className="flex flex-wrap gap-1.5">
                {peakFruits.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => router.push(`/products/${f.slug}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[0.78rem] font-bold bg-g5 text-g1 border border-g4 hover:bg-g4 transition-colors cursor-pointer"
                  >
                    {f.category?.icon || '🍊'} {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {availFruits.length > 0 && (
            <div className="mb-3.5">
              <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-muted mb-2 flex items-center gap-1.5">
                🟡 Tersedia
              </div>
              <div className="flex flex-wrap gap-1.5">
                {availFruits.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => router.push(`/products/${f.slug}`)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[0.78rem] font-bold bg-[rgba(168,207,111,.12)] text-muted border border-[rgba(168,207,111,.3)] hover:bg-[rgba(168,207,111,.2)] transition-colors cursor-pointer"
                  >
                    {f.category?.icon || '🍊'} {f.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {filter !== 'all' && offFruits.length > 0 && (
            <div>
              <div className="text-[0.7rem] font-extrabold uppercase tracking-[0.08em] text-muted mb-2 flex items-center gap-1.5">
                ⚪ Tidak Musim
              </div>
              <div className="flex flex-wrap gap-1.5">
                {offFruits.map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[0.78rem] font-bold bg-sand text-muted border border-faint opacity-70"
                  >
                    {f.category?.icon || '🍊'} {f.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {!peakFruits.length && !availFruits.length && (
            <p className="text-center text-muted text-[0.88rem] py-3">
              Tidak ada buah yang sedang musim di bulan ini.
            </p>
          )}
        </div>
      )}

      {filter !== 'all' &&
        (() => {
          const f = allProducts[parseInt(filter)];
          if (!f) return null;
          const statusMap: Record<string, string> = {
            P: 'bg-g2 text-white',
            A: 'bg-g4 text-ink',
            O: 'bg-sand text-muted',
          };
          const labelMap: Record<string, string> = {
            P: 'Puncak Panen',
            A: 'Tersedia',
            O: 'Tidak Musim',
          };
          return (
            <div className="mt-6 p-5 px-6 bg-g6 rounded-2xl animate-fadeInUp">
              <h4 className="font-lora text-[1.1rem] font-semibold mb-3.5">
                {f.category?.icon || '🍊'} Musim {f.name} Sepanjang Tahun
              </h4>
              <div className="flex flex-wrap gap-2">
                {MONTHS_ID.map((mName, i) => {
                  const status = getSeasonStatus(f, i);
                  return (
                    <span
                      key={i}
                      className={`px-4 py-2 rounded-pill text-[0.82rem] font-bold ${statusMap[status]}`}
                    >
                      {mName.substring(0, 3)} — {labelMap[status]}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}
    </div>
  );
}

/* ════════════════════════════════════════════
   PANEL 2: QUIZ BUAH (API)
   ════════════════════════════════════════════ */
function QuizPanel({
  toast,
}: {
  toast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState<
    { questionId: string; selectedIndex: number }[]
  >([]);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const {
    data: questionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['quiz-questions'],
    queryFn: async () => {
      const { data } = await api.get('/quiz/questions');
      const shuffled = [...(data.data as QuizQuestion[])].sort(
        () => Math.random() - 0.5,
      );
      return shuffled;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (
      ans: { questionId: string; selectedIndex: number }[],
    ) => {
      const { data } = await api.post('/quiz/submit', { answers: ans });
      return data.data as QuizResult;
    },
    onSuccess: (result) => {
      setQuizResult(result);
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      const message =
        axiosErr?.response?.data?.error || 'Gagal mengirim jawaban.';
      toast(message, 'error');
    },
  });

  const questions = questionsData || [];
  const q = questions[qIdx];

  const handleAnswer = (idx: number) => {
    if (answered || !q) return;
    setSelectedIdx(idx);
    setAnswered(true);
    setAnswers((prev) => [...prev, { questionId: q.id, selectedIndex: idx }]);
  };

  const nextQ = () => {
    if (qIdx + 1 >= questions.length) {
      const allAnswers = [...answers];
      if (!isAuthenticated) {
        toast('Login untuk submit quiz dan dapatkan voucher!', 'warning');
        router.push('/auth/login');
        return;
      }
      submitMutation.mutate(allAnswers);
      return;
    }
    setQIdx((i) => i + 1);
    setAnswered(false);
    setSelectedIdx(null);
  };

  const retry = () => {
    setQIdx(0);
    setAnswers([]);
    setAnswered(false);
    setSelectedIdx(null);
    setQuizResult(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 max-w-[680px] mx-auto text-center">
        <div className="animate-spin text-4xl mx-auto mb-4">🧠</div>
        <p className="text-muted">Memuat soal quiz...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 max-w-[680px] mx-auto text-center">
        <span className="text-4xl block mb-3">📝</span>
        <p className="text-muted">Belum ada soal quiz tersedia.</p>
      </div>
    );
  }

  if (quizResult) {
    const { score, total, isPerfect, voucherCode, results } = quizResult;
    let badge = '🏅',
      title = 'Pemula Buah',
      msg = 'Masih banyak yang bisa dipelajari tentang buah-buahan!';
    const pct = Math.round((score / total) * 100);
    if (isPerfect) {
      badge = '🏆';
      title = 'Pakar Buah Sejati!';
      msg = 'Luar biasa! Kamu mendapatkan voucher diskon sebagai hadiah!';
    } else if (pct >= 80) {
      badge = '🥇';
      title = 'Pencinta Buah!';
      msg = 'Hebat! Pengetahuanmu tentang buah sudah sangat baik!';
    } else if (pct >= 60) {
      badge = '🥈';
      title = 'Penjelajah Buah';
      msg = 'Lumayan! Terus pelajari dunia buah-buahan!';
    }

    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 max-w-[680px] mx-auto text-center animate-fadeInUp">
        <span className="text-[4rem] block mb-3">{badge}</span>
        <div className="font-lora text-[2rem] font-semibold mb-2">
          {score} / {total}
        </div>
        <div className="font-lora text-[1.4rem] font-semibold mb-1.5">
          {title}
        </div>
        <p className="text-base text-muted mb-4 leading-relaxed">{msg}</p>

        {isPerfect && voucherCode && (
          <div className="bg-g6 border-2 border-g4 rounded-2xl p-5 mb-6 inline-block mx-auto">
            <p className="text-sm font-bold text-g1 mb-2">
              🎉 Kode Voucher Diskonmu:
            </p>
            <div className="bg-white rounded-xl px-6 py-3 border border-g4 inline-block">
              <span className="text-xl font-black text-g1 tracking-wider">
                {voucherCode}
              </span>
            </div>
            <p className="text-xs text-muted mt-2">
              Gunakan saat checkout untuk mendapat diskon!
            </p>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="text-left mt-6 space-y-3">
            <h4 className="font-bold text-sm text-ink mb-3">Detail Jawaban:</h4>
            {results.map((r, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border ${r.correct ? 'border-g4 bg-g6' : 'border-red/30 bg-red/5'}`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold mb-1">
                  <span>{r.correct ? '✅' : '❌'}</span>
                  <span>Soal {i + 1}</span>
                </div>
                {r.explanation && (
                  <p className="text-xs text-muted">{r.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={retry}
            className="px-9 py-3.5 bg-g1 text-white rounded-pill text-[0.92rem] font-bold border-none shadow-[0_4px_18px_rgba(45,90,0,.35)] transition-all hover:bg-g2 hover:-translate-y-0.5"
          >
            🔄 Main Lagi
          </button>
        </div>
      </div>
    );
  }

  if (submitMutation.isPending) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 max-w-[680px] mx-auto text-center">
        <div className="animate-spin text-4xl mx-auto mb-4">⏳</div>
        <p className="text-muted">Menghitung skor...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 max-w-[680px] mx-auto">
      <div className="flex gap-1.5 justify-center mb-8">
        {questions.map((_: QuizQuestion, i: number) => (
          <span
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
            ${i < qIdx ? 'bg-g2' : i === qIdx ? 'bg-g3 scale-[1.3] shadow-[0_0_8px_rgba(106,171,26,.4)]' : 'bg-faint'}
          `}
          />
        ))}
      </div>

      <div className="text-[0.78rem] text-muted font-bold text-center mb-2">
        Soal {qIdx + 1} dari {questions.length}
      </div>
      <div className="font-lora text-[1.3rem] font-semibold text-center mb-7 leading-[1.4]">
        {q.question}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {q.options.map((opt: string, i: number) => {
          let cls =
            'p-4 px-5 border-2 border-faint rounded-2xl bg-white text-[0.92rem] font-semibold text-left transition-all duration-250 cursor-pointer';
          if (!answered)
            cls += ' hover:border-g3 hover:bg-g6 hover:-translate-y-0.5';
          if (answered) {
            cls += ' pointer-events-none';
            if (i === selectedIdx) cls += ' border-g3 bg-g6 text-g1';
            else cls += ' opacity-60';
          }
          return (
            <button key={i} onClick={() => handleAnswer(i)} className={cls}>
              {opt}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="text-center mt-5">
          <button
            onClick={nextQ}
            className="px-8 py-3 bg-g1 text-white rounded-pill text-[0.88rem] font-bold border-none transition-all hover:bg-g2 hover:-translate-y-0.5 animate-fadeInUp"
          >
            {qIdx + 1 >= questions.length
              ? 'Lihat Hasil →'
              : 'Soal Berikutnya →'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   PANEL 3: KALKULATOR GROSIR (API)
   ════════════════════════════════════════════ */
function CalculatorPanel({
  toast,
}: {
  toast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}) {
  const { isAuthenticated } = useAuthStore();
  const { addToCart } = useCartStore();
  const router = useRouter();
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState(10);
  const [result, setResult] = useState<{
    totalK: number;
    totalR: number;
    saving: number;
    pct: number;
    meetsMin: boolean;
  } | null>(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products-calculator'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=50');
      return data.data as Product[];
    },
  });

  const products = productsData || [];
  const selected = products.find((p) => p.id === productId) || products[0];

  const calculate = () => {
    if (!selected) return;
    const priceK = Number(selected.priceConsumer);
    const priceR = Number(selected.priceReseller);
    const totalK = priceK * qty;
    const totalR = priceR * qty;
    const saving = totalK - totalR;
    const pct = totalK > 0 ? Math.round((saving / totalK) * 100) : 0;
    const meetsMin = qty >= selected.minOrderReseller;
    setResult({ totalK, totalR, saving, pct, meetsMin });
    if (meetsMin) {
      toast(`💰 Hemat ${pct}% dengan harga reseller!`, 'success');
    } else {
      toast(
        `⚠️ Minimum order reseller: ${selected.minOrderReseller} ${selected.unit}`,
        'warning',
      );
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast('Silakan login terlebih dahulu', 'warning');
      router.push('/auth/login');
      return;
    }
    if (!selected) return;
    try {
      await addToCart(selected.id, qty);
      toast('🛒 Berhasil ditambahkan ke keranjang!', 'success');
    } catch {
      toast('Gagal menambahkan ke keranjang', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 text-center">
        <div className="animate-spin text-4xl mx-auto mb-4">🧮</div>
        <p className="text-muted">Memuat data produk...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30 text-center">
        <span className="text-4xl block mb-3">🍎</span>
        <p className="text-muted">Belum ada produk tersedia.</p>
      </div>
    );
  }

  const activeId = productId || products[0]?.id || '';

  return (
    <div className="bg-white rounded-3xl p-10 shadow-card border border-faint/30">
      <h3 className="font-lora text-2xl font-semibold mb-7">
        🧮 Kalkulator Harga Grosir
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <label className="block text-[0.78rem] font-extrabold uppercase tracking-[0.06em] text-muted mb-2">
            Pilih Buah
          </label>
          <select
            value={activeId}
            onChange={(e) => {
              setProductId(e.target.value);
              setResult(null);
            }}
            className="w-full px-4 py-3.5 border-2 border-faint rounded-[14px] text-base font-semibold bg-white outline-none transition-colors focus:border-g3 mb-5"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.category?.icon || '🍊'} {p.name}
              </option>
            ))}
          </select>

          <label className="block text-[0.78rem] font-extrabold uppercase tracking-[0.06em] text-muted mb-2">
            Jumlah ({selected?.unit || 'unit'})
          </label>
          <input
            type="number"
            value={qty}
            onChange={(e) => {
              setQty(parseInt(e.target.value) || 1);
              setResult(null);
            }}
            min={1}
            max={selected?.stock || 1000}
            className="w-full px-4 py-3.5 border-2 border-faint rounded-[14px] text-base font-semibold bg-white outline-none transition-colors focus:border-g3 mb-2"
          />
          {selected && (
            <p className="text-xs text-muted mb-5">
              Min. order reseller: {selected.minOrderReseller} {selected.unit} ·
              Stok: {selected.stock} {selected.unit}
            </p>
          )}

          <button
            onClick={calculate}
            className="w-full py-3.5 bg-g1 text-white rounded-pill text-[0.95rem] font-extrabold border-none shadow-[0_4px_18px_rgba(45,90,0,.35)] transition-all hover:bg-g2 hover:-translate-y-0.5"
          >
            Hitung Perbandingan →
          </button>
        </div>

        {result && selected && (
          <div
            className={`rounded-[20px] p-8 animate-fadeInUp ${result.meetsMin ? 'bg-g6' : 'bg-[#fff5f0] border border-red/20'}`}
          >
            <h4 className="font-lora text-[1.2rem] font-semibold mb-5">
              {result.meetsMin
                ? '💰 Hasil Perbandingan'
                : '⚠️ Hasil Perbandingan'}
            </h4>

            {!result.meetsMin && (
              <div className="bg-[#fff0e8] border border-red/30 rounded-xl p-3 mb-4 text-sm text-red font-bold">
                ❌ Qty belum memenuhi minimum reseller (
                {selected.minOrderReseller} {selected.unit}). Harga reseller
                tidak berlaku — kurang {selected.minOrderReseller - qty}{' '}
                {selected.unit} lagi.
              </div>
            )}

            <div className="divide-y divide-faint">
              {[
                {
                  lab: `Harga Konsumen / ${selected.unit}`,
                  val: formatRupiah(Number(selected.priceConsumer)),
                },
                {
                  lab: `Harga Reseller / ${selected.unit}`,
                  val: formatRupiah(Number(selected.priceReseller)),
                  green: result.meetsMin,
                },
                {
                  lab: 'Jumlah',
                  val: `${qty.toLocaleString('id-ID')} ${selected.unit}`,
                },
                { lab: 'Total Konsumen', val: formatRupiah(result.totalK) },
                {
                  lab: 'Total Reseller',
                  val: formatRupiah(result.totalR),
                  green: result.meetsMin,
                },
                {
                  lab: '💰 Penghematan',
                  val: `${formatRupiah(result.saving)} (${result.pct}%)`,
                  accent: result.meetsMin,
                },
              ].map((r) => (
                <div
                  key={r.lab}
                  className="flex justify-between items-center py-2.5 text-[0.92rem]"
                >
                  <span className="text-muted font-semibold">{r.lab}</span>
                  <span
                    className={`font-extrabold ${r.accent ? 'text-g2 text-[1.1rem]' : r.green ? 'text-g1' : 'text-ink'}`}
                  >
                    {r.val}
                  </span>
                </div>
              ))}
            </div>

            {result.meetsMin && (
              <div className="mt-4 space-y-2">
                <span className="inline-block px-[18px] py-2 rounded-pill bg-g1 text-white text-[0.82rem] font-bold">
                  ✨ Kamu hemat {formatRupiah(result.saving)} dengan harga
                  reseller!
                </span>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-g2 text-white rounded-pill text-[0.88rem] font-bold border-none transition-all hover:bg-g1 hover:-translate-y-0.5 mt-3"
                >
                  🛒 Pesan Sekarang — Tambah ke Keranjang
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
