import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import MapSection from '@/components/about/MapSection';

const TEAM = [
  {
    image: '/images/owner/owner.jpeg',
    name: 'Mohamad Kamdi',
    role: 'Founder',
    desc: 'Penggerak utama. Membangun BuahKita dari mimpi sederhana memotong rantai distribusi buah.',
  },
  {
    image: '/images/team/ahmadfaris.jpeg',
    name: 'Ahmad Faris Al Aziz',
    role: 'Fullstack Developer',
    desc: 'Mengatur roadmap produk, koordinasi tim pengembangan, dan memastikan pengembangan Frontend dan Backendnya agar selaras dengan produk akhir',
  },
  {
    image: '/images/team/malik.jpeg',
    name: 'Mohammad Malik Raihan O',
    role: 'Fullstack Developer',
    desc: 'Berfokus pada pengembangan API, logika bisnis, dan integrasi database agar sistem tetap cepat, aman, dan skalabel.',
  },
  {
    image: '/images/team/renaldi.jpeg',
    name: 'Renaldi Simamora',
    role: 'Fullstack Developer',
    desc: 'Mengerjakan antarmuka pengguna dan integrasi layanan agar pengalaman pengguna konsisten, responsif, dan mudah digunakan.',
  },
  {
    image: '/images/team/nabil.jpeg',
    name: 'Nabil Kurnia Rozano',
    role: 'Fullstack Developer',
    desc: 'Menangani pengujian, perbaikan bug, dan peningkatan kualitas fitur untuk memastikan aplikasi siap digunakan di production.',
  },
];

const ALUR = [
  {
    ico: '🌱',
    title: 'Panen Segar',
    desc: 'Petani mitra memanen buah di pagi hari untuk menjaga kesegaran optimal',
  },
  {
    ico: '✅',
    title: 'Quality Control',
    desc: 'Setiap buah melewati pengecekan kualitas ketat sebelum masuk sistem',
  },
  {
    ico: '📦',
    title: 'Sortir & Packing',
    desc: 'Disortir berdasarkan grade lalu dikemas agar tetap segar saat sampai',
  },
  {
    ico: '🚚',
    title: 'Distribusi Cepat',
    desc: 'Dikirim di hari yang sama atau siap ambil di lokasi kami',
  },
  {
    ico: '😊',
    title: 'Sampai ke Kamu',
    desc: 'Buah segar premium hadir di meja makan kamu dalam kondisi terbaik',
  },
];

const MISSIONS = [
  {
    ico: '🎯',
    title: 'Visi',
    desc: 'Menjadi platform buah lokal #1 di Indonesia yang menghubungkan petani dan konsumen secara transparan dan berkelanjutan.',
  },
  {
    ico: '🌱',
    title: 'Misi 1 — Kesejahteraan Petani',
    desc: 'Memberikan harga adil dan akses pasar langsung kepada petani mitra tanpa perantara berlebih.',
  },
  {
    ico: '🤝',
    title: 'Misi 2 — Transparansi Total',
    desc: 'Setiap buah memiliki identitas asal, mulai dari nama petani, lokasi kebun, hingga tanggal panen.',
  },
  {
    ico: '🚀',
    title: 'Misi 3 — Digitalisasi UMKM',
    desc: 'Membantu petani dan reseller lokal memanfaatkan teknologi digital untuk meningkatkan skala usaha.',
  },
];

export const revalidate = 600;

async function getResellerLocations() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/reseller-maps`,
      { cache: 'no-store' },
    );
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const resellerLocations = await getResellerLocations();
  const supplierLat = parseFloat(
    process.env.NEXT_PUBLIC_SUPPLIER_LAT || '-6.2748',
  );
  const supplierLng = parseFloat(
    process.env.NEXT_PUBLIC_SUPPLIER_LNG || '106.8672',
  );

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen">
        {/* Page Header */}
        <div className="pt-[120px] pb-[60px] px-[6%] bg-g6 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(168,207,111,.22)_0%,transparent_65%)] pointer-events-none" />
          <div className="max-w-[640px]">
            <div className="flex items-center gap-2 text-[0.78rem] font-semibold text-muted mb-[18px]">
              <Link
                href="/"
                className="text-muted no-underline hover:text-g2 transition-colors"
              >
                Beranda
              </Link>
              <span className="text-faint">›</span>
              <span>Tentang Kami</span>
            </div>
            <div className="sec-ey">Kenali Kami</div>
            <h1 className="font-lora text-[clamp(2rem,4vw,3.2rem)] font-semibold tracking-tight leading-[1.15] mb-3">
              Cerita di Balik <em className="italic text-g2">BuahKita</em>
            </h1>
            <p className="text-[0.95rem] text-muted leading-[1.75]">
              Dari mimpi sederhana untuk mendekatkan petani dan konsumen,
              BuahKita kini menjadi jembatan digital antara kebun lokal terbaik
              Indonesia dengan meja makan kamu.
            </p>
          </div>
        </div>

        {/* Owner Section */}
        <section className="py-[72px] px-[6%] bg-white">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-14 items-center max-w-[1000px] mx-auto">
            {/* Visual */}
            <div className="relative max-w-[340px] mx-auto md:mx-0">
              <div className="w-full aspect-[4/5] bg-gradient-to-br from-g4 to-g5 rounded-[28px] flex items-center justify-center relative overflow-hidden">
                <Image
                  src="/images/owner/owner.jpeg"
                  alt="Mohamad Kamdi"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(45,90,0,.15)]" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white border-[1.5px] border-faint rounded-[18px] p-3.5 px-[18px] shadow-[0_8px_32px_rgba(45,90,0,.12)] min-w-[180px]">
                <div className="text-[0.67rem] font-extrabold text-muted tracking-[0.08em] uppercase mb-[5px]">
                  Pendiri & CEO
                </div>
                <div className="text-[0.85rem] font-extrabold text-g1">
                  Mohamad Kamdi
                </div>
                <div className="text-[0.73rem] text-muted mt-[2px]">
                  Sejak 1998, Jakarta Timur
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="sec-ey">Pendiri Kami</div>
              <h2 className="font-lora text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-tight leading-[1.2] mb-4">
                Dibangun dengan <em className="italic text-g2">Passion</em>,
                <br />
                Digerakkan oleh Petani
              </h2>
              <p className="text-[0.9rem] text-muted leading-[1.8] mb-3.5">
                BuahKita lahir dari keresahan Mohamad Kamdi saat melihat buah
                segar impor mendominasi rak supermarket, sementara hasil kebun
                petani lokal sulit menembus pasar karena sistem distribusi yang
                panjang dan tidak transparan.
              </p>
              <p className="text-[0.9rem] text-muted leading-[1.8] mb-5">
                Dengan latar belakang teknologi dan kecintaan pada pertanian
                lokal, Kamdi membangun BuahKita sebagai platform yang memotong
                rantai distribusi — menghubungkan langsung petani mitra ke
                konsumen dan reseller, dengan harga yang adil untuk semua pihak.
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  '🌱 10+ Petani Mitra',
                  '🌿 100% Lokal',
                  '📍 Jakarta Timur',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-g6 border border-faint rounded-pill px-3.5 py-[7px] text-[0.78rem] font-bold text-g1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-2.5 mt-6 pt-6 border-t border-faint">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-g5 flex items-center justify-center text-[0.95rem] flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <strong className="block text-[0.88rem] font-extrabold text-ink">
                      Jl. H. Taiman Ujung No.67, RT.7/RW.4, Kp. Tengah, Kec.
                      Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota
                      Jakarta 13540
                    </strong>
                    <span className="text-[0.82rem] font-semibold text-muted">
                      Buka Senin–Sabtu, 06.00–15.00 WIB
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-g5 flex items-center justify-center text-[0.95rem] flex-shrink-0">
                    📱
                  </div>
                  <div>
                    <strong className="block text-[0.88rem] font-extrabold text-ink">
                      +62 877-8299-2379
                    </strong>
                    <span className="text-[0.82rem] font-semibold text-muted">
                      WhatsApp & Telepon
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-g5 flex items-center justify-center text-[0.95rem] flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <strong className="block text-[0.88rem] font-extrabold text-ink">
                      hello@buahkita.id
                    </strong>
                    <span className="text-[0.82rem] font-semibold text-muted">
                      Balas dalam 1×24 jam
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <div className="bg-g1 py-11 px-[6%]">
          <div className="grid grid-cols-2 md:grid-cols-4 max-w-[900px] mx-auto">
            {[
              { val: '10+', label: 'Petani Mitra Aktif' },
              { val: '2.400+', label: 'Pesanan Terproses' },
              { val: '12', label: 'Provinsi Terjangkau' },
              { val: '98%', label: 'Pelanggan Puas' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`text-center px-6 relative ${i < 3 ? 'md:border-r md:border-white/15' : ''}`}
              >
                <strong className="block text-[2.4rem] font-black text-g4 tracking-tight leading-none mb-1.5">
                  {s.val}
                </strong>
                <span className="text-[0.78rem] text-white/70 font-semibold tracking-wide">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visi Misi */}
        <section className="py-20 px-[6%] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-[1080px] mx-auto items-center">
            {/* Left */}
            <div className="pr-5">
              <div className="sec-ey">Visi & Misi Kami</div>
              <h2 className="font-lora text-[clamp(1.6rem,2.5vw,2.2rem)] font-semibold tracking-tight mb-4">
                Mengubah Cara Indonesia{' '}
                <em className="italic text-g2">Membeli</em> Buah
              </h2>
              <p className="text-[0.9rem] text-muted leading-relaxed mb-5">
                Kami percaya petani lokal bisa sejahtera tanpa harus bergantung
                pada tengkulak. BuahKita membangun jembatan digital langsung
                dari kebun ke meja makan kamu.
              </p>
              {/* Before vs After */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                <div className="bg-[#fff8f0] border-[1.5px] border-[#f0dcc0] rounded-[20px] p-6 text-center">
                  <div className="text-[2.5rem] mb-2.5">😢</div>
                  <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-muted mb-2">
                    Sebelumnya
                  </div>
                  <h4 className="text-base font-extrabold mb-1.5">
                    Rantai Distribusi Panjang
                  </h4>
                  <p className="text-[0.78rem] text-muted leading-relaxed">
                    Petani → Tengkulak → Pengepul → Distributor → Toko →
                    Konsumen. Harga mahal, petani tidak sejahtera.
                  </p>
                </div>
                <div className="text-[2rem] text-g3 font-black text-center md:rotate-0 rotate-90 self-center">
                  →
                </div>
                <div className="bg-g6 border-[1.5px] border-faint rounded-[20px] p-6 text-center">
                  <div className="text-[2.5rem] mb-2.5">🌿</div>
                  <div className="text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-muted mb-2">
                    Dengan BuahKita
                  </div>
                  <h4 className="text-base font-extrabold mb-1.5">
                    Langsung dari Kebun
                  </h4>
                  <p className="text-[0.78rem] text-muted leading-relaxed">
                    Petani → BuahKita → Konsumen. Lebih segar, harga jujur,
                    petani lebih sejahtera.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — Mission items */}
            <div className="flex flex-col gap-4">
              {MISSIONS.map((m) => (
                <div
                  key={m.title}
                  className="flex items-start gap-3.5 p-[18px] px-5 bg-g6 rounded-2xl border border-faint transition-transform duration-200 hover:translate-x-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-g5 flex items-center justify-center text-[1.3rem] flex-shrink-0">
                    {m.ico}
                  </div>
                  <div>
                    <h4 className="text-[0.92rem] font-extrabold mb-[3px]">
                      {m.title}
                    </h4>
                    <p className="text-[0.8rem] text-muted leading-[1.5]">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alur Kerja — Farm to Table */}
        <section className="py-20 px-[6%] bg-g6">
          <div className="text-center">
            <div className="sec-ey justify-center">Farm to Table</div>
            <h2 className="font-lora text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-tight">
              Perjalanan Buah dari <em className="italic text-g2">Kebun</em> ke
              Mejamu
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5 max-w-[1080px] mx-auto mt-10 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-g5 via-g3 to-g5" />
            {ALUR.map((a) => (
              <div key={a.title} className="text-center relative z-[1]">
                <div className="w-20 h-20 rounded-full bg-white border-[3px] border-g4 flex items-center justify-center text-[2rem] mx-auto mb-3.5 shadow-[0_4px_20px_rgba(45,90,0,.08)] transition-all duration-300 hover:scale-110 hover:bg-g5 hover:shadow-[0_8px_28px_rgba(45,90,0,.15)]">
                  {a.ico}
                </div>
                <h4 className="text-[0.88rem] font-extrabold mb-1">
                  {a.title}
                </h4>
                <p className="text-[0.75rem] text-muted leading-[1.5]">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Tim BuahKita */}
        <section className="py-20 px-[6%] bg-white">
          <div className="text-center">
            <div className="sec-ey justify-center">Tim Kami</div>
            <h2 className="font-lora text-[clamp(1.8rem,3vw,2.4rem)] font-semibold tracking-tight">
              Orang-Orang di Balik <em className="italic text-g2">BuahKita</em>
            </h2>
            <p className="text-muted text-[0.9rem] mt-2.5 max-w-[520px] mx-auto leading-relaxed">
              Tim kecil dengan visi besar — menghubungkan petani dan konsumen
              lewat teknologi dan cinta pada buah lokal.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1080px] mx-auto mt-10">
            {TEAM.map((t) => (
              <div
                key={t.name}
                className="text-center p-7 px-5 bg-g6 rounded-3xl border-[1.5px] border-faint transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(45,90,0,.1)]"
              >
                <div className="w-[72px] h-[72px] rounded-full bg-g5 flex items-center justify-center mx-auto mb-3.5 border-[3px] border-g4 relative overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-[0.95rem] font-extrabold mb-[2px]">
                  {t.name}
                </h4>
                <div className="text-[0.75rem] font-bold text-g2 mb-2">
                  {t.role}
                </div>
                <p className="text-[0.78rem] text-muted leading-[1.5]">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Map Section */}
        <MapSection
          resellerLocations={resellerLocations}
          supplierLat={supplierLat}
          supplierLng={supplierLng}
        />

        {/* Contact Section */}
        <section className="py-[72px] px-[6%] bg-white" id="kontak">
          <div className="max-w-[640px] mx-auto text-center">
            <div className="sec-ey justify-center">Hubungi Kami</div>
            <h2 className="font-lora text-[clamp(1.8rem,3vw,2.4rem)] font-semibold mb-3">
              Ada Pertanyaan?
              <br />
              <em className="italic text-g2">Kami Siap</em> Membantu
            </h2>
            <p className="text-muted text-[0.9rem] leading-relaxed mb-8">
              Tim kami siap membantu kamu melalui berbagai saluran komunikasi.
              Pilih yang paling mudah untukmu!
            </p>
            <div className="flex flex-col gap-3 text-left">
              {[
                {
                  ico: '💬',
                  icoBg: 'bg-[#25d366]',
                  label: 'WhatsApp',
                  sub: '+62 877-8299-2379 · Respon cepat',
                  href: 'https://wa.me/6287782992379',
                },
                {
                  ico: '📸',
                  icoBg: 'bg-gradient-to-br from-[#f58529] to-[#dd2a7b]',
                  label: 'Instagram',
                  sub: '@buahkita.id · DM untuk promo',
                  href: '#',
                },
                {
                  ico: '📧',
                  icoBg: 'bg-g1',
                  label: 'Email',
                  sub: 'hello@buahkita.id · Balasan 1×24 jam',
                  href: 'mailto:hello@buahkita.id',
                },
                {
                  ico: '📍',
                  icoBg: 'bg-[#4285f4]',
                  label: 'Kunjungi Langsung',
                  sub: 'Jl. H. Taiman Ujung No.67, RT.7/RW.4, Kp. Tengah, Kec. Kramat jati, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13540 ',
                  href: '#lokasi',
                },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  className="flex items-center gap-3.5 bg-g6 border-[1.5px] border-faint rounded-2xl p-4 px-[18px] cursor-pointer transition-all duration-200 no-underline hover:border-g3 hover:bg-g5 hover:translate-x-1 group"
                >
                  <div
                    className={`w-[42px] h-[42px] rounded-[14px] flex items-center justify-center text-xl text-white flex-shrink-0 ${c.icoBg}`}
                  >
                    {c.ico}
                  </div>
                  <div className="flex-1 min-w-0">
                    <strong className="block text-[0.88rem] font-extrabold text-ink mb-[2px]">
                      {c.label}
                    </strong>
                    <span className="text-[0.77rem] text-muted">{c.sub}</span>
                  </div>
                  <span className="text-muted text-[0.85rem] transition-transform duration-200 group-hover:translate-x-[3px]">
                    ›
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
