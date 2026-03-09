'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import StarRating from '@/components/ui/StarRating';

interface Testimonial {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
  product: { name: string };
}

export default function TestimonialSection() {
  const { data: reviews } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await api.get('/reviews/latest');
      return data.data as Testimonial[];
    },
  });

  const testimonials = reviews?.length
    ? reviews
    : [
        {
          id: '1',
          rating: 5,
          comment:
            'Buah selalu segar dan kualitas terjamin. Pengiriman cepat dan packaging rapi! Sudah langganan setahun lebih.',
          user: { name: 'Rina Sari' },
          product: { name: 'Mangga Harum Manis' },
        },
        {
          id: '2',
          rating: 5,
          comment:
            'Harga reseller sangat kompetitif, cocok untuk toko buah saya. Invoice otomatis sangat membantu pembukuan.',
          user: { name: 'Budi Santoso' },
          product: { name: 'Jeruk Pontianak' },
        },
        {
          id: '3',
          rating: 4,
          comment:
            'Platform yang sangat membantu. Quiz buahnya juga seru dan edukatif! Anak-anak saya suka banget.',
          user: { name: 'Dewi Lestari' },
          product: { name: 'Semangka Merah' },
        },
      ];

  return (
    <section className="py-[90px] px-[6%] bg-g6">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="sec-ey justify-center">Testimoni Pelanggan</div>
        <h2 className="sec-title">
          Kata <em>Mereka</em>
        </h2>
      </div>

      {/* Summary Bar */}
      <div className="bg-g1 rounded-[20px] p-6 flex items-center justify-between flex-wrap gap-4 max-w-5xl mx-auto mb-10">
        <div className="flex items-center gap-4">
          <span className="text-[2.5rem] font-black text-white">4.9</span>
          <div>
            <StarRating rating={5} size="sm" />
            <p className="text-white/90 text-[0.75rem] font-semibold mt-0.5">
              dari {testimonials.length * 100}+ ulasan
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          {[
            { label: 'Kualitas', val: '98%' },
            { label: 'Pengiriman', val: '96%' },
            { label: 'Pelayanan', val: '97%' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-lg font-black text-white">{s.val}</div>
              <div className="text-[0.68rem] text-white/90 font-semibold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl p-6 border border-faint shadow-sm hover:shadow-card hover:-translate-y-1 transition-[transform,box-shadow] duration-300"
          >
            <StarRating rating={t.rating} size="sm" />
            <p className="text-[0.85rem] text-muted leading-relaxed mt-3 mb-4">
              &ldquo;{t.comment}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-g5 flex items-center justify-center text-g1 font-bold text-sm">
                {t.user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{t.user.name}</p>
                <p className="text-xs text-muted">{t.product.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
