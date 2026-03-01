'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab?: 'login' | 'register';
}

export default function AuthLayout({ children, activeTab }: AuthLayoutProps) {
  const pathname = usePathname();
  const current =
    activeTab || (pathname?.includes('register') ? 'register' : 'login');

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT PANEL — dark */}
      <div className="hidden md:flex flex-col justify-between p-11 min-h-screen relative overflow-hidden bg-ink">
        {/* Decorative gradient circle */}
        <div className="absolute -bottom-[200px] -left-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(45,90,0,0.5)_0%,transparent_65%)] pointer-events-none" />

        <div className="relative z-[1]">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-lora text-[1.3rem] font-semibold text-white no-underline mb-14"
          >
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-g2 to-g4 flex items-center justify-center text-base shadow-[0_2px_10px_rgba(69,125,0,0.3)]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            BuahKita
          </Link>

          <h2 className="font-lora text-[clamp(1.8rem,2.8vw,2.8rem)] font-semibold text-white leading-[1.2] tracking-tight mb-4">
            Belanja Buah Segar,
            <br />
            <em className="italic text-g4">Langsung dari</em>
            <br />
            Petaninya
          </h2>
          <p className="text-[0.9rem] text-white/45 leading-[1.75] max-w-[360px] mb-9">
            Bergabung dan nikmati kemudahan pesan, invoice otomatis, dan
            transparansi penuh rantai distribusi buah lokal Indonesia.
          </p>

          {/* Features */}
          <div className="flex flex-col gap-2.5">
            {[
              {
                icon: '📋',
                title: 'Invoice PDF Otomatis',
                desc: 'Setiap pesanan langsung punya invoice formal',
              },
              {
                icon: '📤',
                title: 'Upload Bukti Transfer',
                desc: 'Konfirmasi bayar tanpa kirim foto ke WA',
              },
              {
                icon: '📦',
                title: 'Pantau Status Real-Time',
                desc: 'Lacak pesanan dari dibuat hingga selesai',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-3 bg-white/5 border border-white/[0.08] rounded-[14px] py-3 px-4"
              >
                <div className="w-[34px] h-[34px] rounded-[10px] bg-[rgba(168,207,111,0.15)] flex items-center justify-center text-[0.95rem] flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <strong className="block text-[0.83rem] font-bold text-white mb-px">
                    {f.title}
                  </strong>
                  <span className="text-[0.73rem] text-white/40">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-white/5 border border-white/10 rounded-[18px] p-5 relative z-[1] mt-5">
          <p className="font-lora italic text-[0.88rem] text-white/65 leading-[1.7] mb-2.5">
            &ldquo;Dulu repot banget pesan lewat WA. Sekarang semua di website —
            invoice langsung ada, upload bukti TF langsung dikonfirmasi!&rdquo;
          </p>
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-full bg-g5 flex items-center justify-center text-[0.85rem]">
              👩
            </div>
            <div>
              <strong className="text-[0.78rem] text-white block">
                Rista Amelia
              </strong>
              <span className="text-[0.7rem] text-white/35">
                Pelanggan sejak 2025, Semarang
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex flex-col items-center justify-center px-10 py-10 overflow-y-auto bg-cream">
        <div className="w-full max-w-[420px]">
          {/* Tabs */}
          <div className="flex bg-white border-[1.5px] border-faint rounded-pill p-1 gap-1 mb-7">
            <Link
              href="/auth/login"
              className={`flex-1 py-2.5 rounded-pill text-[0.85rem] font-bold text-center no-underline transition-all duration-250 ${
                current === 'login'
                  ? 'bg-g1 text-white shadow-[0_2px_12px_rgba(45,90,0,0.3)]'
                  : 'text-muted bg-transparent'
              }`}
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className={`flex-1 py-2.5 rounded-pill text-[0.85rem] font-bold text-center no-underline transition-all duration-250 ${
                current === 'register'
                  ? 'bg-g1 text-white shadow-[0_2px_12px_rgba(45,90,0,0.3)]'
                  : 'text-muted bg-transparent'
              }`}
            >
              Daftar Akun
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
