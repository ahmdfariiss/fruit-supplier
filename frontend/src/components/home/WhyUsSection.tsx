import Image from 'next/image';
import {
  LeafIcon,
  PackageIcon,
  TruckIcon,
  WalletIcon,
} from '@/components/ui/icons';
import FadeIn from '@/components/ui/FadeIn';

export default function WhyUsSection() {
  const points = [
    {
      icon: <LeafIcon className="w-5 h-5 text-g1" />,
      title: 'Langsung dari Kebun',
      desc: 'Buah dipetik langsung dari kebun mitra petani terpercaya. Tanpa perantara, kualitas lebih terjaga.',
    },
    {
      icon: <WalletIcon className="w-5 h-5 text-g1" />,
      title: 'Harga Transparan',
      desc: 'Harga konsumen dan reseller transparan, tanpa biaya tersembunyi. Hemat hingga 30% untuk reseller.',
    },
    {
      icon: <PackageIcon className="w-5 h-5 text-g1" />,
      title: 'Packaging Khusus',
      desc: 'Packaging premium khusus buah dengan foam net, bubble wrap, dan kontrol suhu optimal.',
    },
    {
      icon: <TruckIcon className="w-5 h-5 text-g1" />,
      title: 'Pengiriman Cepat',
      desc: 'Dikirim same-day untuk area lokal. Next-day delivery untuk kota besar di Pulau Jawa.',
    },
  ];

  return (
    <section className="py-[90px] px-[6%] bg-white cv-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        {/* Left Visual — Kebun Mitra */}
        <FadeIn direction="right" className="relative">
          <div className="rounded-[28px] min-h-[420px] relative overflow-hidden shadow-lg">
            <Image
              src="/images/kebun/kebun.jpg"
              alt="Kebun mitra BuahKita — perkebunan buah segar"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-g1/70 via-g1/20 to-transparent" />

            {/* Stats badge */}
            <div className="absolute top-6 right-6 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
              <div className="text-white text-sm font-bold">
                Mitra Petani Aktif
              </div>
              <div className="text-2xl font-black text-white">10+</div>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-lg font-bold drop-shadow-md">
                🌿 Kebun Mitra BuahKita
              </p>
              <p className="text-white/80 text-sm mt-1">
                Buah segar langsung dari kebun pilihan
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Right Content */}
        <div>
          <FadeIn direction="up">
            <div className="sec-ey">Kenapa BuahKita</div>
            <h2 className="sec-title mb-8">
              Kualitas <em>Premium</em>,<br />
              Harga Bersahabat
            </h2>
          </FadeIn>

          <div className="space-y-5">
            {points.map((pt, i) => (
              <FadeIn key={pt.title} direction="left" delay={0.1 + i * 0.1}>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-g6 flex items-center justify-center text-xl flex-shrink-0 border border-g5">
                    {pt.icon}
                  </div>
                  <div>
                    <h3 className="text-[0.92rem] font-extrabold text-ink mb-1">
                      {pt.title}
                    </h3>
                    <p className="text-[0.82rem] text-muted leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
