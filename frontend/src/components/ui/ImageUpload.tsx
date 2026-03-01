'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File) => void;
  label?: string;
  accept?: string;
  maxSizeMB?: number;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Upload Gambar',
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Ukuran file maksimal ${maxSizeMB}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    onChange(file);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-ink mb-1.5">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className={`
          relative w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-200 overflow-hidden
          ${preview ? 'border-g3' : 'border-faint hover:border-g3'}
          ${error ? 'border-red-400' : ''}
        `}
      >
        {preview ? (
          <Image src={preview} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">📷</span>
            <p className="text-sm font-semibold text-muted">
              Klik untuk upload
            </p>
            <p className="text-xs text-muted/70">
              JPG, PNG, WebP • Maks {maxSizeMB}MB
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
