'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import { getImageUrl } from '@/lib/image';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  isActive: boolean;
  order: number;
}

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data } = await api.get('/admin/banners');
      return data.data as Banner[];
    },
  });

  const banners = data || [];

  const handleAdd = async () => {
    if (!title.trim() || !imageFile) {
      alert('Judul dan gambar wajib diisi');
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('image', imageFile);
      if (linkUrl.trim()) formData.append('linkUrl', linkUrl);
      await api.post('/admin/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setTitle(''); setLinkUrl(''); setImageFile(null);
    } catch {
      alert('Gagal menambah banner');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (banner: Banner) => {
    setTogglingId(banner.id);
    try {
      await api.patch(`/admin/banners/${banner.id}`, { isActive: !banner.isActive });
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    } catch {
      alert('Gagal mengubah status banner');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (banner: Banner) => {
    setDeleteTarget(banner);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await api.delete(`/admin/banners/${deleteTarget.id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    } catch {
      alert('Gagal menghapus banner');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <h1 className="font-lora text-2xl font-semibold text-ink mb-6">Banner</h1>

      {/* Add Form */}
      <div className="bg-white rounded-2xl border border-faint p-6 mb-6">
        <h3 className="font-bold text-ink mb-4">Tambah Banner Baru</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Judul Banner *</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Promo Akhir Tahun"
              className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">URL Tujuan (opsional)</label>
            <input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="/products?tags=promo"
              className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors" />
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Gambar Banner *</label>
          <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            imageFile ? 'border-g3 bg-g6' : 'border-faint hover:border-g3 hover:bg-g6'
          }`}>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
              onChange={e => setImageFile(e.target.files?.[0] || null)} />
            {imageFile ? (
              <div>
                <span className="text-2xl block mb-1">✅</span>
                <p className="text-sm font-bold text-g1">{imageFile.name}</p>
                <p className="text-xs text-muted mt-1">Klik untuk ganti</p>
              </div>
            ) : (
              <div>
                <span className="text-2xl block mb-1">🖼️</span>
                <p className="text-sm font-bold text-ink">Klik untuk pilih gambar</p>
                <p className="text-xs text-muted mt-1">JPG, PNG, WebP — Rekomendasi 1200×400px</p>
              </div>
            )}
          </label>
        </div>

        <button
          onClick={handleAdd}
          disabled={adding}
          className="px-6 py-2.5 bg-g1 text-white rounded-xl text-sm font-bold hover:bg-g2 transition-colors disabled:opacity-50"
        >
          {adding ? '⏳ Menambahkan...' : '+ Tambah Banner'}
        </button>
      </div>

      {/* Banner List */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="px-5 py-4 border-b border-faint">
          <h3 className="font-bold text-ink">Banner Aktif ({banners.filter(b => b.isActive).length}/{banners.length})</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : banners.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <span className="text-3xl block mb-2">🖼️</span>
            <p className="text-sm font-semibold">Belum ada banner</p>
          </div>
        ) : (
          <div className="divide-y divide-faint">
            {banners.map((banner) => (
              <div key={banner.id} className="flex items-center gap-4 p-4 hover:bg-g6/30 transition-colors">
                {/* Preview */}
                <div className="relative w-32 h-16 rounded-xl overflow-hidden bg-g6 flex-shrink-0 border border-faint">
                  {banner.imageUrl
                    ? <Image src={getImageUrl(banner.imageUrl)} alt={banner.title} fill className="object-cover" sizes="128px" />
                    : <div className="absolute inset-0 flex items-center justify-center text-xl">🖼️</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-ink truncate">{banner.title}</p>
                  {banner.linkUrl && (
                    <p className="text-xs text-muted truncate mt-0.5">🔗 {banner.linkUrl}</p>
                  )}
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${
                    banner.isActive ? 'bg-g5 text-g1' : 'bg-faint text-muted'
                  }`}>
                    {banner.isActive ? '✅ Aktif' : '⏸️ Nonaktif'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(banner)}
                    disabled={togglingId === banner.id}
                    className={`w-10 h-6 rounded-full transition-all relative ${
                      banner.isActive ? 'bg-g1' : 'bg-faint'
                    } disabled:opacity-50`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                      banner.isActive ? 'left-5' : 'left-1'
                    }`} />
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    disabled={deletingId === banner.id}
                    className="px-3 py-1.5 rounded-lg bg-red/10 text-red text-xs font-bold hover:bg-red/20 transition-all disabled:opacity-50"
                  >
                    {deletingId === banner.id ? '...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        message={`Hapus banner "${deleteTarget?.title}"?`}
        loading={!!deletingId}
      />
    </div>
  );
}