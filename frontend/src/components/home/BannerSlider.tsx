'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
}

interface BannerSliderProps {
  banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (banners.length === 0) return null;

  const isSvg = (url: string) => url.endsWith('.svg');

  return (
    <div className="relative rounded-3xl overflow-hidden bg-ink">
      {/* Slides */}
      <div className="relative aspect-[21/9] md:aspect-[3/1]">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === current ? 'opacity-100' : 'opacity-0'
            } ${banner.linkUrl ? 'cursor-pointer' : ''}`}
            onClick={() => banner.linkUrl && window.open(banner.linkUrl, '_blank')}
          >
            {isSvg(banner.imageUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
                priority={idx === 0}
              />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <h3 className="text-white font-bold text-lg md:text-2xl max-w-md">
                {banner.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center justify-center"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all flex items-center justify-center"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === current
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
