import Link from 'next/link';

export default function ResellerBand() {
  const perks = [
    {
      icon: '💰',
      title: 'Harga Grosir',
      desc: 'Diskon hingga 30% dari harga konsumen',
    },
    {
      icon: '📋',
      title: 'Invoice Otomatis',
      desc: 'Setiap transaksi langsung dapat invoice PDF',
    },
    {
      icon: '🚚',
      title: 'Prioritas Kirim',
      desc: 'Pengiriman prioritas untuk reseller aktif',
    },
  ];

  return (
    <section className="py-[90px] px-[6%] bg-g6 relative overflow-hidden cv-auto">
      {/* Decorative */}
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(45,90,0,0.3)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-g1 mb-3">
            <span className="w-[18px] h-[2px] bg-g4 inline-block" />
            Untuk Reseller
          </div>
          <h2 className="font-lora text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-g1 tracking-tight leading-[1.15] mb-5">
            Jadi Reseller,
            <br />
            <em className="italic text-g4">Raih Untung Lebih</em>
          </h2>
          <p className="text-ink/80 text-[0.9rem] leading-relaxed max-w-md mb-8">
            Bergabung sebagai reseller BuahKita dan nikmati harga grosir
            eksklusif, invoice otomatis, dan prioritas pengiriman.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/auth/register"
              className="bg-g1 text-white py-3 px-7 rounded-pill font-extrabold text-[0.88rem] no-underline transition-all duration-200 shadow-btn hover:bg-g2 hover:-translate-y-0.5"
            >
              Daftar Reseller
            </Link>
            <Link
              href="/products?buyerType=reseller"
              className="bg-transparent text-ink py-[15px] px-[30px] rounded-pill border-2 border-ink/[0.12] text-[0.95rem] font-bold no-underline transition-all duration-200 hover:border-g2 hover:text-g2 hover:bg-g6"
            >
              Lihat Harga Grosir
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {perks.map((p) => (
              <div
                key={p.title}
                className="flex items-center gap-4 bg-g2/5 border border-faint/10 rounded-[18px] p-5 
                transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-g2/10 hover:border-g2/30 cursor-pointer"
              >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {p.icon}
              </div>
              <div>
                <h3 className="text-[0.88rem] font-extrabold text-g1 mb-0.5">
                  {p.title}
                </h3>
                <p className="text-[0.78rem] text-ink/80">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
