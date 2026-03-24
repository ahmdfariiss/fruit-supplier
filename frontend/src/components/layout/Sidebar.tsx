'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeftIcon,
  BannerIcon,
  BrainIcon,
  DashboardIcon,
  FruitIcon,
  MapPinIcon,
  PackageIcon,
  TicketIcon,
  UsersIcon,
} from '@/components/ui/icons';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: DashboardIcon },
  { href: '/admin/products', label: 'Produk', icon: FruitIcon },
  { href: '/admin/orders', label: 'Pesanan', icon: PackageIcon },
  { href: '/admin/banners', label: 'Banner', icon: BannerIcon },
  { href: '/admin/quiz', label: 'Quiz', icon: BrainIcon },
  { href: '/admin/vouchers', label: 'Voucher', icon: TicketIcon },
  { href: '/admin/reseller-maps', label: 'Peta Reseller', icon: MapPinIcon },
  { href: '/admin/users', label: 'Pengguna', icon: UsersIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-ink text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2 no-underline">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo.png"
            alt="BuahKita"
            width={38}
            height={38}
            className="rounded-full object-contain h-auto w-auto"
          />
          <div>
            <span className="font-lora text-lg font-semibold text-white block">
              BuahKita
            </span>
            <span className="text-[0.65rem] text-white/70 font-semibold tracking-widest uppercase">
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
                  <link.icon className="w-4 h-4" />
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
            text-white/70 hover:bg-white/8 hover:text-white transition-all no-underline"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Toko
        </Link>
      </div>
    </aside>
  );
}
