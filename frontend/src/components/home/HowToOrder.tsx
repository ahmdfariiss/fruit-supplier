'use client';

export default function HowToOrder() {
  const steps = [
    {
      num: 1,
      icon: '🔍',
      title: 'Pilih Buah',
      desc: 'Jelajahi katalog dan pilih buah favorit kamu',
    },
    {
      num: 2,
      icon: '🛒',
      title: 'Masukkan Keranjang',
      desc: 'Atur jumlah dan tipe pembeli (konsumen/reseller)',
    },
    {
      num: 3,
      icon: '💳',
      title: 'Checkout & Transfer',
      desc: 'Konfirmasi pesanan dan transfer ke rekening kami',
    },
    {
      num: 4,
      icon: '📦',
      title: 'Terima di Rumah',
      desc: 'Buah segar dikirim dengan packaging khusus',
    },
  ];

  return (
    <section className="py-[90px] px-[6%]">
      <div className="text-center mb-14">
        <div className="sec-ey justify-center">Cara Pesan</div>
        <h2 className="sec-title">
          Semudah <em>1-2-3-4</em>
        </h2>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Connecting line */}
        <div className="hidden lg:block absolute top-[40px] left-[80px] right-[80px] h-[2px] bg-faint z-0" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((s) => (
            <div key={s.num} className="text-center">
              <div className="w-20 h-20 rounded-full bg-white border-2 border-faint mx-auto mb-5 flex items-center justify-center text-3xl shadow-kpi relative">
                {s.icon}
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-g1 text-white text-[0.65rem] font-extrabold flex items-center justify-center">
                  {s.num}
                </span>
              </div>
              <h4 className="text-[0.9rem] font-extrabold text-ink mb-1.5">
                {s.title}
              </h4>
              <p className="text-[0.78rem] text-muted leading-relaxed max-w-[200px] mx-auto">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
