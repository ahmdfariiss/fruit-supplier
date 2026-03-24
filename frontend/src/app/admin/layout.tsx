'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Spinner from '@/components/ui/Spinner';
import {
  ArrowLeftIcon,
  BannerIcon,
  BrainIcon,
  DashboardIcon,
  FruitIcon,
  LogoutIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  TicketIcon,
  UsersIcon,
} from '@/components/ui/icons';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', iconKey: 'dashboard', exact: true },
  { href: '/admin/orders', label: 'Pesanan', iconKey: 'orders' },
  { href: '/admin/products', label: 'Produk', iconKey: 'products' },
  { href: '/admin/banners', label: 'Banner', iconKey: 'banners' },
  { href: '/admin/quiz', label: 'Quiz', iconKey: 'quiz' },
  { href: '/admin/vouchers', label: 'Voucher', iconKey: 'vouchers' },
  { href: '/admin/reseller-maps', label: 'Peta Reseller', iconKey: 'maps' },
  { href: '/admin/users', label: 'Pengguna', iconKey: 'users' },
];

const navIcons = {
  dashboard: DashboardIcon,
  orders: PackageIcon,
  products: FruitIcon,
  banners: BannerIcon,
  quiz: BrainIcon,
  vouchers: TicketIcon,
  maps: MapPinIcon,
  users: UsersIcon,
} as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-sm text-muted mt-3 font-semibold">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-g1 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-g4 flex items-center justify-center text-lg text-g1">
              <FruitIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-[0.92rem] leading-none">
                BuahKita
              </div>
              <div className="text-white/70 text-[0.65rem] font-semibold tracking-wider mt-0.5">
                ADMIN PANEL
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) =>
            (() => {
              const Icon = navIcons[item.iconKey as keyof typeof navIcons];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl mb-1 text-[0.88rem] font-semibold no-underline transition-all duration-200
                    ${
                      isActive(item)
                        ? 'bg-white/15 text-white font-extrabold'
                        : 'text-white/60 hover:bg-white/8 hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {isActive(item) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-g4" />
                  )}
                </Link>
              );
            })(),
          )}
        </nav>

        {/* User Info */}
        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-g4 flex items-center justify-center text-sm font-extrabold text-g1">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[0.8rem] font-bold truncate">
                {user?.name}
              </p>
              <p className="text-white/70 text-[0.68rem] truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              useAuthStore.getState().logout();
              router.push('/');
            }}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-white/8 text-white/60 text-[0.78rem] font-semibold hover:bg-white/15 hover:text-white transition-all text-left inline-flex items-center gap-2"
          >
            <LogoutIcon className="w-4 h-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-faint px-6 py-3.5 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl border border-faint flex items-center justify-center text-ink hover:bg-g6 transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <span className="text-[0.78rem] text-muted font-semibold">
              {NAV_ITEMS.find(isActive)?.label || 'Admin'}
            </span>
          </div>
          <Link
            href="/"
            className="text-[0.78rem] font-bold text-muted no-underline hover:text-g1 transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeftIcon className="w-4 h-4" /> Lihat Toko
          </Link>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
