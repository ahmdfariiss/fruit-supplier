'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Produk', icon: '🍎' },
  { href: '/admin/orders', label: 'Pesanan', icon: '📦' },
  { href: '/admin/banners', label: 'Banner', icon: '🖼️' },
  { href: '/admin/quiz', label: 'Quiz', icon: '❓' },
  { href: '/admin/vouchers', label: 'Voucher', icon: '🎟️' },
  { href: '/admin/reseller-maps', label: 'Peta Reseller', icon: '🗺️' },
  { href: '/admin/users', label: 'Pengguna', icon: '👤' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-ink text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2 no-underline">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-g2 to-g4 flex items-center justify-center text-sm">
            🍊
          </div>
          <div>
            <span className="font-lora text-lg font-semibold text-white block">
              BuahKita
            </span>
            <span className="text-[0.65rem] text-white/40 font-semibold tracking-widest uppercase">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1 list-none">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/admin' && pathname?.startsWith(link.href));

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                    transition-all duration-200 no-underline
                    ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }
                  `}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
            text-white/50 hover:bg-white/8 hover:text-white transition-all no-underline"
        >
          ← Kembali ke Toko
        </Link>
      </div>
    </aside>
  );
}
