import Link from 'next/link';
import { TicketIcon, TruckIcon, WalletIcon } from '@/components/ui/icons';

export default function ResellerBand() {
  const perks = [
    {
      icon: <WalletIcon className="w-5 h-5 text-white" />,
      title: 'Harga Grosir',
      desc: 'Diskon hingga 30% dari harga konsumen',
    },
    {
      icon: <TicketIcon className="w-5 h-5 text-white" />,
      title: 'Invoice Otomatis',
      desc: 'Setiap transaksi langsung dapat invoice PDF',
    },
    {
      icon: <TruckIcon className="w-5 h-5 text-white" />,
      title: 'Prioritas Kirim',
      desc: 'Pengiriman prioritas untuk reseller aktif',
    },
  ];

  return (
    <section className="py-[90px] px-[6%] bg-ink relative overflow-hidden cv-auto">
      {/* Decorative */}
      <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(45,90,0,0.3)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[0.72rem] font-extrabold tracking-[0.1em] uppercase text-g4 mb-3">
            <span className="w-[18px] h-[2px] bg-g4 inline-block" />
            Untuk Reseller
          </div>
          <h2 className="font-lora text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold text-white tracking-tight leading-[1.15] mb-5">
            Jadi Reseller,
            <br />
            <em className="italic text-g4">Raih Untung Lebih</em>
          </h2>
          <p className="text-white/80 text-[0.9rem] leading-relaxed max-w-md mb-8">
            Bergabung sebagai reseller BuahKita dan nikmati harga grosir
            eksklusif, invoice otomatis, dan prioritas pengiriman.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/auth/register"
              className="bg-g3 text-white py-3 px-7 rounded-pill font-extrabold text-[0.88rem] no-underline transition-all duration-200 shadow-btn hover:bg-g2 hover:-translate-y-0.5"
            >
              Daftar Reseller
            </Link>
            <Link
              href="/products?buyerType=reseller"
              className="text-white/70 py-3 px-7 rounded-pill font-bold text-[0.88rem] no-underline border border-white/25 transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              Lihat Harga Grosir
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[18px] p-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {p.icon}
              </div>
              <div>
                <h3 className="text-[0.88rem] font-extrabold text-white mb-0.5">
                  {p.title}
                </h3>
                <p className="text-[0.78rem] text-white/80">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
