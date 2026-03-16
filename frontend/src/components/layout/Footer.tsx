import Link from 'next/link';

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
    <footer className="bg-cream text-black cv-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/images/logo2.png" 
                alt="BuahKita Logo" 
                width={150}
                height={150}
                className="object-contain" 
                />
              {/* <span className="font-lora text-xl font-semibold">BuahKita</span> */}
            </div>
            <p className="text-black/100 text-sm leading-relaxed max-w-xs mb-8 mt-8">
              Platform buah segar terpercaya. Menghubungkan kebun lokal dengan
              konsumen dan reseller di seluruh Indonesia.
            </p>
            <div className="flex gap-5">
              {[
                { src: '/images/emailKami.png', label: 'Email kami' },
                { src: '/images/hubungi.png', label: 'Hubungi kami' },
                { src: '/images/location.png', label: 'Lokasi kami' },
              ].map((item, i) => (
                <span
                  key={i}
                  aria-label={item.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <img src={item.src} alt={item.label} className="w-6 h-6 object-contain" />
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm mb-4 text-black/90">{title}</h3>
              <ul className="space-y-2.5 list-none">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-black/70 text-sm hover:text-black transition-colors no-underline"
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
        <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-black/80 text-xs" suppressHydrationWarning>
            © {new Date().getFullYear()} BuahKita. Semua hak dilindungi.
          </p>
          <div className="flex gap-6">
            <span className="text-black/80 text-xs hover:text-black cursor-pointer transition-colors">
              Kebijakan Privasi
            </span>
            <span className="text-black/80 text-xs hover:text-black cursor-pointer transition-colors">
              Syarat & Ketentuan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
