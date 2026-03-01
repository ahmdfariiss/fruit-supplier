'use client';

export default function Ticker() {
  const items = [
    '🍊 Jeruk Pontianak',
    '🥭 Mangga Harum Manis',
    '🍎 Apel Malang',
    '🍇 Anggur Import',
    '🍌 Pisang Cavendish',
    '🍉 Semangka Merah',
    '🫐 Blueberry',
    '🍓 Stroberi Lembang',
    '🍑 Peach Import',
    '🍈 Melon Harum',
    '🥝 Kiwi Gold',
    '🍍 Nanas Madu',
  ];

  return (
    <div className="ticker">
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="ticker-item">
            {item} <span className="text-g4">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
