import {
  FruitIcon,
  LeafIcon,
  MapPinIcon,
  PackageIcon,
} from '@/components/ui/icons';

export default function ImpactCounter() {
  const stats = [
    {
      value: '150+',
      label: 'Petani Mitra',
      icon: <LeafIcon className="w-8 h-8 mx-auto text-white" />,
    },
    {
      value: '500+',
      label: 'Jenis Buah',
      icon: <FruitIcon className="w-8 h-8 mx-auto text-white" />,
    },
    {
      value: '10K+',
      label: 'Pesanan Selesai',
      icon: <PackageIcon className="w-8 h-8 mx-auto text-white" />,
    },
    {
      value: '50+',
      label: 'Kota Terjangkau',
      icon: <MapPinIcon className="w-8 h-8 mx-auto text-white" />,
    },
  ];

  return (
    <section className="py-16 px-[6%] bg-g1 cv-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="text-3xl block mb-2">{s.icon}</span>
            <div className="text-[2rem] font-black text-white tracking-tight">
              {s.value}
            </div>
            <div className="text-[0.72rem] font-semibold text-white/90 uppercase tracking-widest">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
