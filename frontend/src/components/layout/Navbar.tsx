'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/products', label: 'Produk' },
  { href: '/playground', label: 'Playground' },
  { href: '/about', label: 'Tentang' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((s) => s.totalItems);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 30;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const itemCount = cartItems();

  return (
    <header className="fixed top-[18px] left-1/2 -translate-x-1/2 z-[999] w-[calc(100%-40px)] max-w-[1080px]">
      <nav
        aria-label="Navigasi utama"
        className={`
          flex items-center justify-between rounded-full px-3 py-2.5 pl-5
          border transition-all duration-400
          ${
            scrolled
              ? 'bg-white/92 border-white/90 shadow-[0_8px_48px_rgba(45,90,0,0.16),0_1px_0_rgba(255,255,255,0.9)_inset]'
              : 'bg-white/72 border-white/90 shadow-[0_4px_32px_rgba(45,90,0,0.1),0_1px_0_rgba(255,255,255,0.8)_inset]'
          }
          backdrop-blur-md
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline" aria-label="BuahKita - Kembali ke beranda">
          <img 
                src="/images/contoh logo2(2).png" 
                alt="BuahKita Logo" 
                width={38}
                height={38}
                className="rounded-full object-contain" 
          />
          <span className="font-lora text-[1.2rem] font-semibold text-g1 tracking-tight">
            BuahKita
          </span>
        </Link>

        {/* Nav Links - Desktop */}
        <ul className="hidden md:flex gap-1 list-none" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={`
                  text-[0.82rem] font-semibold px-3.5 py-1.5 rounded-full
                  transition-all duration-200 no-underline
                  ${
                    pathname === link.href
                      ? 'bg-g1 text-white'
                      : 'text-muted hover:bg-g6 hover:text-g1'
                  }
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            aria-label={`Keranjang belanja${itemCount > 0 ? `, ${itemCount} item` : ', kosong'}`}
            className="relative w-[38px] h-[38px] rounded-full bg-g6 flex items-center justify-center hover:bg-g5 transition-all hover:scale-105"
          >
            <span className="text-base" aria-hidden="true">🛒</span>
            {itemCount > 0 && (
              <span aria-hidden="true" className="absolute top-0.5 right-0.5 w-[15px] h-[15px] rounded-full bg-[#e84d1c] text-white text-[0.55rem] font-extrabold flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/orders"
                aria-label="Lihat pesanan saya"
                className="hidden sm:flex items-center gap-1 px-3.5 py-2 rounded-full text-[0.82rem] font-bold text-muted hover:bg-g6 hover:text-g1 transition-all no-underline"
              >
                <span aria-hidden="true">📦</span> Pesanan
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  aria-label="Panel admin"
                  className="hidden sm:flex items-center gap-1 px-3.5 py-2 rounded-full text-[0.82rem] font-bold bg-g6 text-g1 hover:bg-g5 transition-all no-underline"
                >
                  <span aria-hidden="true">⚙️</span> Admin
                </Link>
              )}
              <button
                onClick={logout}
                aria-label="Keluar dari akun"
                className="px-4 py-2 rounded-full text-[0.82rem] font-bold border border-faint text-ink hover:border-red-300 hover:text-red-500 transition-all bg-transparent font-cabinet cursor-pointer"
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex px-4 py-2 rounded-full text-[0.82rem] font-bold border border-faint text-ink hover:border-g2 hover:text-g2 transition-all no-underline bg-transparent"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="hidden sm:inline-flex px-5 py-2.5 rounded-full text-[0.82rem] font-bold bg-g1 text-white hover:bg-g2 transition-all no-underline shadow-[0_2px_12px_rgba(45,90,0,0.35)] hover:-translate-y-0.5"
              >
                Mulai Belanja
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden w-[38px] h-[38px] rounded-full bg-g6 flex items-center justify-center text-lg hover:bg-g5 transition-all"
          >
            <span aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="navigation"
          aria-label="Menu navigasi mobile"
          className="md:hidden mt-3 bg-white/95 backdrop-blur-xl rounded-3xl border border-white/90 shadow-lg p-5"
        >
          <ul className="flex flex-col gap-1 list-none mb-4" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={`
                    block text-sm font-semibold px-4 py-3 rounded-2xl
                    transition-all no-underline
                    ${
                      pathname === link.href
                        ? 'bg-g1 text-white'
                        : 'text-muted hover:bg-g6 hover:text-g1'
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {!isAuthenticated && (
            <div className="flex gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-3 rounded-full text-sm font-bold border border-faint text-ink no-underline"
              >
                Masuk
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-3 rounded-full text-sm font-bold bg-g1 text-white no-underline"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
