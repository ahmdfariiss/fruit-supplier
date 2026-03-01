'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string | null;
  order: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: async () => {
      const { data } = await api.get('/admin/banners');
      return data.data as Banner[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('title', title);
      if (linkUrl) formData.append('linkUrl', linkUrl);
      if (imageFile) formData.append('image', imageFile);
      if (editBanner) {
        return api.put(`/admin/banners/${editBanner.id}`, formData);
      }
      return api.post('/admin/banners', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/banners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/banners/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditBanner(null);
    setTitle('');
    setLinkUrl('');
    setImageFile(null);
    setImagePreview(null);
  };

  const openEdit = (banner: Banner) => {
    setEditBanner(banner);
    setTitle(banner.title);
    setLinkUrl(banner.linkUrl || '');
    setImagePreview(banner.imageUrl || null);
    setImageFile(null);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const banners = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Manajemen Banner
        </h1>
        <Button onClick={() => setShowForm(true)}>+ Tambah Banner</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="bg-white rounded-2xl border border-faint overflow-hidden"
          >
            <div className="relative aspect-[2/1]">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                className="object-cover"
              />
              {!banner.isActive && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    Tidak Aktif
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-ink text-sm mb-2">
                {banner.title}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(banner)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    toggleMutation.mutate({
                      id: banner.id,
                      isActive: !banner.isActive,
                    })
                  }
                >
                  {banner.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(banner.id)}
                  className="text-red-500"
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12 text-muted bg-white rounded-2xl border border-faint">
          Belum ada banner
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editBanner ? 'Edit Banner' : 'Tambah Banner'}
      >
        <div className="space-y-4">
          <Input
            label="Judul"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Link URL (opsional)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
          />
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Gambar Banner
            </label>
            {imagePreview && (
              <div className="relative w-full aspect-[2/1] rounded-xl overflow-hidden mb-2">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
              className="text-sm"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={resetForm}>
              Batal
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={
                saveMutation.isPending ||
                !title ||
                (!imageFile && !imagePreview)
              }
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
