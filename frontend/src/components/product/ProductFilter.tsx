'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types/product';
import { FruitIcon, LeafIcon, SearchIcon } from '@/components/ui/icons';

interface ProductFilterProps {
  categories: Category[];
}

const TAG_LIST = [
  { key: 'Terlaris', icon: '🔥' },
  { key: 'Baru', icon: '✨' },
  { key: 'Promo', icon: '💰' },
  { key: 'Organik', icon: '🌿' },
  { key: 'Lokal', icon: '🏠' },
];

const MONTH_NAMES = [
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

export default function ProductFilter({ categories }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [seasonMonth, setSeasonMonth] = useState(
    searchParams.get('seasonMonth') || '',
  );
  const [seasonEnabled, setSeasonEnabled] = useState(
    !!searchParams.get('seasonMonth'),
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (sort && sort !== 'popular') params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (activeTags.size > 0) params.set('tags', [...activeTags].join(','));
      if (seasonEnabled && seasonMonth) params.set('seasonMonth', seasonMonth);

      const queryStr = params.toString();
      router.push(`/products${queryStr ? `?${queryStr}` : ''}`, {
        scroll: false,
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [
    search,
    category,
    sort,
    minPrice,
    maxPrice,
    activeTags,
    seasonEnabled,
    seasonMonth,
    router,
  ]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="bg-white rounded-[20px] p-6 border border-faint">
        <div className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted mb-4 flex items-center gap-1.5">
          Cari Produk
          <span className="flex-1 h-px bg-faint" />
        </div>
        <div className="flex items-center gap-2.5 bg-g6 border-[1.5px] border-faint rounded-pill px-4 py-2.5 focus-within:border-g3 transition-colors">
          <SearchIcon className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Ketik nama buah..."
            aria-label="Cari produk"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-transparent outline-none font-sans text-[0.85rem] text-ink w-full placeholder:text-muted"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-[20px] p-6 border border-faint">
        <div className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted mb-4 flex items-center gap-1.5">
          Kategori
          <span className="flex-1 h-px bg-faint" />
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory('')}
            className={`flex items-center justify-between px-3 py-[9px] rounded-xl text-[0.875rem] font-semibold transition-all border-[1.5px] border-transparent ${
              !category
                ? 'bg-g1 text-white border-g1'
                : 'text-muted hover:bg-g6 hover:text-g1'
            }`}
          >
            <span className="inline-flex items-center gap-1.5"><LeafIcon className="w-4 h-4" /> Semua Buah</span>
            <span className="text-[0.7rem] font-extrabold opacity-60 bg-white/20 px-[7px] py-[2px] rounded-pill">
              {categories.length || '—'}
            </span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`flex items-center justify-between px-3 py-[9px] rounded-xl text-[0.875rem] font-semibold transition-all border-[1.5px] border-transparent ${
                category === cat.slug
                  ? 'bg-g1 text-white border-g1'
                  : 'text-muted hover:bg-g6 hover:text-g1'
              }`}
            >
                <span className="inline-flex items-center gap-1.5">
                  {cat.icon ? (
                    <span>{cat.icon}</span>
                  ) : (
                    <FruitIcon className="w-4 h-4" />
                  )}{' '}
                  {cat.name}
                </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white rounded-[20px] p-6 border border-faint">
        <div className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted mb-4 flex items-center gap-1.5">
          Rentang Harga
          <span className="flex-1 h-px bg-faint" />
        </div>
        <div className="flex gap-2 items-center mb-2 lg:flex-col lg:items-stretch lg:gap-2.5">
          <input
            type="number"
            placeholder="Min"
            aria-label="Harga minimum"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
            className="flex-1 min-w-0 border-[1.5px] border-faint rounded-[10px] px-3 py-2 font-sans text-[0.82rem] text-ink bg-white outline-none focus:border-g3 transition-colors"
          />
          <span className="text-muted text-[0.8rem] lg:hidden">—</span>
          <input
            type="number"
            placeholder="Max"
            aria-label="Harga maksimum"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
            className="flex-1 min-w-0 border-[1.5px] border-faint rounded-[10px] px-3 py-2 font-sans text-[0.82rem] text-ink bg-white outline-none focus:border-g3 transition-colors"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white rounded-[20px] p-6 border border-faint">
        <div className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted mb-4 flex items-center gap-1.5">
          Urutkan
          <span className="flex-1 h-px bg-faint" />
        </div>
        <select
          value={sort}
          aria-label="Urutkan produk"
          onChange={(e) => setSort(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-faint bg-white font-sans text-[0.85rem] text-ink outline-none cursor-pointer focus:border-g3 transition-colors"
        >
          <option value="popular">Paling Populer</option>
          <option value="newest">Terbaru</option>
          <option value="price_asc">Harga: Terendah</option>
          <option value="price_desc">Harga: Tertinggi</option>
        </select>
      </div>

      {/* Season Filter */}
      <div className="bg-white rounded-[20px] p-6 border border-faint">
        <div className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted mb-4 flex items-center gap-1.5">
          Buah Musiman
          <span className="flex-1 h-px bg-faint" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[0.82rem] font-semibold text-ink">
            Filter Musim
          </span>
          <button
            onClick={() => {
              const next = !seasonEnabled;
              setSeasonEnabled(next);
              if (next && !seasonMonth) {
                setSeasonMonth(String(new Date().getMonth() + 1));
              }
            }}
            role="switch"
            aria-checked={seasonEnabled}
            aria-label="Filter buah musiman"
            className={`w-10 h-[22px] rounded-full relative cursor-pointer transition-colors ${
              seasonEnabled ? 'bg-g1' : 'bg-faint'
            }`}
          >
            <div
              className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all ${
                seasonEnabled ? 'left-[20px]' : 'left-[2px]'
              }`}
            />
          </button>
        </div>
        {seasonEnabled && (
          <select
            value={seasonMonth}
            aria-label="Pilih bulan musim"
            onChange={(e) => setSeasonMonth(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-[1.5px] border-faint bg-white font-sans text-[0.85rem] text-ink outline-none cursor-pointer focus:border-g3 transition-colors"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx + 1} value={String(idx + 1)}>
                {name}{' '}
                {idx + 1 === new Date().getMonth() + 1 ? '(Sekarang)' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Tags */}
      <div className="bg-white rounded-[20px] p-6 border border-faint">
        <div className="text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-muted mb-4 flex items-center gap-1.5">
          Tag
          <span className="flex-1 h-px bg-faint" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TAG_LIST.map((t) => (
            <button
              key={t.key}
              onClick={() => toggleTag(t.key)}
              className={`px-3 py-[5px] rounded-pill text-[0.75rem] font-bold border-[1.5px] font-sans transition-all ${
                activeTags.has(t.key)
                  ? 'bg-g5 border-g4 text-g1'
                  : 'bg-transparent border-faint text-muted hover:bg-g5 hover:border-g4 hover:text-g1'
              }`}
            >
              {t.icon} {t.key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
