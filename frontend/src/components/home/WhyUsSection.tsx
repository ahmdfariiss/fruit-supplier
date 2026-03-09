export default function WhyUsSection() {
  const points = [
    {
      icon: '🌿',
      title: 'Langsung dari Kebun',
      desc: 'Buah dipetik langsung dari kebun mitra petani terpercaya. Tanpa perantara, kualitas lebih terjaga.',
    },
    {
      icon: '💰',
      title: 'Harga Transparan',
      desc: 'Harga konsumen dan reseller transparan, tanpa biaya tersembunyi. Hemat hingga 30% untuk reseller.',
    },
    {
      icon: '📦',
      title: 'Packaging Khusus',
      desc: 'Packaging premium khusus buah dengan foam net, bubble wrap, dan kontrol suhu optimal.',
    },
    {
      icon: '🚚',
      title: 'Pengiriman Cepat',
      desc: 'Dikirim same-day untuk area lokal. Next-day delivery untuk kota besar di Pulau Jawa.',
    },
  ];

  return (
    <section className="py-[90px] px-[6%] bg-white cv-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        {/* Left Visual */}
        <div className="relative">
          <div className="bg-gradient-to-br from-g1 to-g2 rounded-[28px] p-10 min-h-[420px] flex items-end relative overflow-hidden">
            <div className="absolute top-6 right-6 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 border border-white/20">
              <div className="text-white text-sm font-bold">
                Mitra Petani Aktif
              </div>
              <div className="text-2xl font-black text-white">150+</div>
            </div>
            <div className="text-center w-full">
              <span className="text-[5rem] block mb-4">🌾</span>
              <p className="text-white/90 text-sm font-semibold">
                Kebun Mitra BuahKita
              </p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <div className="sec-ey">Kenapa BuahKita</div>
          <h2 className="sec-title mb-8">
            Kualitas <em>Premium</em>,<br />
            Harga Bersahabat
          </h2>

          <div className="space-y-5">
            {points.map((pt) => (
              <div key={pt.title} className="flex gap-4">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
