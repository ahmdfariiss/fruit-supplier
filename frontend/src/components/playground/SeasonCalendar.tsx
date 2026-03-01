'use client';

import { useState } from 'react';
import { MONTH_NAMES } from '@/lib/constants';

interface SeasonData {
  name: string;
  months: number[];
  emoji: string;
}

interface SeasonCalendarProps {
  fruits?: SeasonData[];
}

const defaultFruits: SeasonData[] = [
  { name: 'Mangga', months: [9, 10, 11, 12, 1, 2], emoji: '🥭' },
  { name: 'Rambutan', months: [11, 12, 1, 2, 3], emoji: '🔴' },
  { name: 'Durian', months: [11, 12, 1, 2], emoji: '🍈' },
  { name: 'Jeruk', months: [6, 7, 8, 9], emoji: '🍊' },
  { name: 'Semangka', months: [10, 11, 12, 1, 2, 3], emoji: '🍉' },
  {
    name: 'Nanas',
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    emoji: '🍍',
  },
];

export default function SeasonCalendar({
  fruits = defaultFruits,
}: SeasonCalendarProps) {
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="bg-white rounded-3xl border border-faint p-6">
      <h3 className="font-bold text-ink text-lg mb-1">
        🗓️ Kalender Musim Buah
      </h3>
      <p className="text-sm text-muted mb-6">
        Cek ketersediaan buah berdasarkan musim
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-3 font-bold text-ink text-xs min-w-[140px]">
                Buah
              </th>
              {MONTH_NAMES.map((month, idx) => (
                <th
                  key={month}
                  className={`text-center py-2 px-1 font-bold text-xs min-w-[44px] cursor-pointer transition-colors ${
                    idx + 1 === currentMonth
                      ? 'text-g1 bg-g6 rounded-t-lg'
                      : hoveredMonth === idx + 1
                        ? 'text-g2'
                        : 'text-muted'
                  }`}
                  onMouseEnter={() => setHoveredMonth(idx + 1)}
                  onMouseLeave={() => setHoveredMonth(null)}
                >
                  {month.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fruits.map((fruit) => (
              <tr key={fruit.name} className="border-t border-faint/50">
                <td className="py-2.5 px-3 font-semibold text-ink">
                  <span className="mr-2">{fruit.emoji}</span>
                  {fruit.name}
                </td>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1;
                  const inSeason = fruit.months.includes(month);
                  const isCurrent = month === currentMonth;

                  return (
                    <td key={month} className="text-center py-2 px-1">
                      <div
                        className={`
                          w-8 h-8 rounded-lg mx-auto flex items-center justify-center
                          transition-all duration-200 text-xs
                          ${
                            inSeason
                              ? isCurrent
                                ? 'bg-g1 text-white font-bold shadow-sm'
                                : 'bg-g5 text-g1'
                              : 'bg-transparent text-faint'
                          }
                        `}
                      >
                        {inSeason ? '●' : '·'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-faint/50">
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="w-4 h-4 rounded bg-g5" />
          <span>Musim Panen</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="w-4 h-4 rounded bg-g1" />
          <span>Bulan Saat Ini</span>
        </div>
      </div>
    </div>
  );
}
