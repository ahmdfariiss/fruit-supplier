'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const SupplierMap = dynamic(() => import('@/components/maps/SupplierMap'), {
  ssr: false,
});
const ResellerMap = dynamic(() => import('@/components/maps/ResellerMap'), {
  ssr: false,
});

interface ResellerLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string | null;
}

interface MapSectionProps {
  resellerLocations: ResellerLocation[];
  supplierLat: number;
  supplierLng: number;
}

export default function MapSection({
  resellerLocations,
  supplierLat,
  supplierLng,
}: MapSectionProps) {
  const [mapView, setMapView] = useState<'supplier' | 'reseller'>('supplier');

  return (
    <section className="py-[72px] px-[6%] bg-cream" id="lokasi">
      <div className="flex items-end justify-between flex-wrap gap-5 mb-8">
        <div>
          <div className="sec-ey">Lokasi</div>
          <h2 className="font-lora text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-tight leading-[1.2] mt-2">
            Temukan Kami & <em className="italic text-g2">Mitra</em> Petani Kami
          </h2>
          <p className="text-[0.88rem] text-muted leading-[1.65] max-w-[440px] mt-2">
            Pilih lokasi di bawah untuk melihat posisi kantor BuahKita atau kebun
            mitra petani kami secara langsung di peta.
          </p>
        </div>
      </div>

      {/* Map Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMapView('supplier')}
          className={`px-4 py-2 rounded-xl text-[0.82rem] font-bold transition-all ${
            mapView === 'supplier'
              ? 'bg-g1 text-white shadow-md'
              : 'bg-g6 text-muted border border-faint hover:bg-g5'
          }`}
        >
          🏪 Kantor BuahKita
        </button>
        <button
          onClick={() => setMapView('reseller')}
          className={`px-4 py-2 rounded-xl text-[0.82rem] font-bold transition-all ${
            mapView === 'reseller'
              ? 'bg-g1 text-white shadow-md'
              : 'bg-g6 text-muted border border-faint hover:bg-g5'
          }`}
        >
          🌳 Mitra Reseller ({resellerLocations.length})
        </button>
      </div>

      {/* Map */}
      <div className="relative rounded-3xl overflow-hidden shadow-[0_12px_48px_rgba(45,90,0,.13)] border-2 border-faint bg-g5">
        {mapView === 'supplier' ? (
          <>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 px-[18px] border border-white/90 shadow-[0_4px_20px_rgba(45,90,0,.12)] min-w-[220px] z-[1000]">
              <div className="text-[0.65rem] font-extrabold tracking-[0.08em] uppercase text-muted mb-[5px]">
                Sedang ditampilkan
              </div>
              <div className="text-[0.95rem] font-extrabold text-ink mb-[3px]">
                Kantor BuahKita
              </div>
              <div className="text-[0.75rem] text-muted leading-[1.5]">
                Jl. Pasar Buah No. 12
                <br />
                Semarang, Jawa Tengah
              </div>
              <div className="inline-flex items-center gap-1 bg-g5 text-g1 text-[0.65rem] font-extrabold px-[9px] py-[3px] rounded-pill mt-1.5 border border-faint">
                🏪 Kantor Pusat
              </div>
            </div>
            <SupplierMap
              center={[supplierLat, supplierLng]}
              zoom={14}
              className="!rounded-none !border-none"
            />
          </>
        ) : (
          <>
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 px-[18px] border border-white/90 shadow-[0_4px_20px_rgba(45,90,0,.12)] min-w-[220px] z-[1000]">
              <div className="text-[0.65rem] font-extrabold tracking-[0.08em] uppercase text-muted mb-[5px]">
                Sedang ditampilkan
              </div>
              <div className="text-[0.95rem] font-extrabold text-ink mb-[3px]">
                Mitra Reseller
              </div>
              <div className="text-[0.75rem] text-muted leading-[1.5]">
                {resellerLocations.length} lokasi mitra aktif
              </div>
            </div>
            <ResellerMap
              locations={resellerLocations}
              center={[supplierLat, supplierLng]}
              zoom={6}
              className="!rounded-none !border-none"
            />
          </>
        )}
      </div>

      {/* Reseller Location Cards */}
      {resellerLocations.length > 0 && (
        <div className="mt-6">
          <div className="text-[0.78rem] font-bold text-muted tracking-[0.04em] uppercase mb-3">
            🌳 Klik untuk lihat lokasi reseller mitra
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {resellerLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => setMapView('reseller')}
                className="bg-white border-2 border-faint rounded-2xl p-3.5 px-4 cursor-pointer transition-all duration-200 flex items-center gap-3 hover:border-g4 hover:bg-g6"
              >
                <div className="w-[38px] h-[38px] rounded-xl bg-g5 flex items-center justify-center text-lg flex-shrink-0">
                  🏪
                </div>
                <div>
                  <span className="text-[0.82rem] font-extrabold block mb-[2px]">
                    {loc.name}
                  </span>
                  <div className="text-[0.72rem] text-muted">📍 {loc.address}</div>
                  {loc.phone && (
                    <span className="text-[0.68rem] font-bold bg-g5 text-g2 px-[7px] py-[2px] rounded-pill inline-block mt-1">
                      📞 {loc.phone}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}