import Link from 'next/link';
import Image from 'next/image';
import { MailIcon, MapPinIcon, PhoneIcon } from '@/components/ui/icons';

const footerLinks = {
  Produk: [
    { label: 'Semua Buah', href: '/products' },
    { label: 'Buah Musiman', href: '/products?tags=musiman' },
    { label: 'Paket Reseller', href: '/products?buyerType=reseller' },
  ],
  Layanan: [
    { label: 'Playground Buah', href: '/playground' },
    { label: 'Quiz Buah', href: '/playground#quiz' },
    { label: 'Kalkulator Grosir', href: '/playground#calculator' },
  ],
  Perusahaan: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Peta Reseller', href: '/about#maps' },
    { label: 'Hubungi Kami', href: '/about#contact' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-white cv-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt=""
                width={38}
                height={38}
                className="rounded-full object-contain h-auto w-auto"
              />
              <span className="font-lora text-xl font-semibold">BuahKita</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mb-6">
              Platform buah segar terpercaya. Menghubungkan kebun lokal dengan
              konsumen dan reseller di seluruh Indonesia.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: MailIcon, label: 'Email kami' },
                { Icon: PhoneIcon, label: 'Hubungi kami' },
                { Icon: MapPinIcon, label: 'Lokasi kami' },
              ].map((item, i) => (
                <span
                  key={i}
                  role="img"
                  aria-label={item.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <item.Icon className="w-4 h-4" />
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm mb-4 text-white/90">{title}</h3>
              <ul className="space-y-2.5 list-none">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/70 text-sm hover:text-white transition-colors no-underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/80 text-xs">
            © {new Date().getFullYear()} BuahKita. Semua hak dilindungi.
          </p>
          <div className="flex gap-6">
            <span className="text-white/80 text-xs hover:text-white cursor-pointer transition-colors">
              Kebijakan Privasi
            </span>
            <span className="text-white/80 text-xs hover:text-white cursor-pointer transition-colors">
              Syarat & Ketentuan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
