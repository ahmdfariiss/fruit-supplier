'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import dynamic from 'next/dynamic';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import {
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  StoreIcon,
} from '@/components/ui/icons';

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

const EMPTY_FORM = {
  name: '',
  address: '',
  lat: '',
  lng: '',
  phone: '',
};

export default function AdminResellerMapsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResellerLocation | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reseller-maps'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reseller-maps');
      return data.data as ResellerLocation[];
    },
  });

  const locations = data || [];

  const handleSave = async () => {
    if (!form.name.trim() || !form.address.trim())
      return alert('Nama dan alamat wajib diisi');
    if (!form.lat || !form.lng)
      return alert('Koordinat latitude & longitude wajib diisi');
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng))
      return alert('Koordinat harus berupa angka valid');
    if (lat < -90 || lat > 90) return alert('Latitude harus antara -90 dan 90');
    if (lng < -180 || lng > 180)
      return alert('Longitude harus antara -180 dan 180');

    setSaving(true);
    try {
      await api.post('/admin/reseller-maps', {
        name: form.name,
        address: form.address,
        lat,
        lng,
        phone: form.phone || null,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-reseller-maps'] });
      queryClient.invalidateQueries({ queryKey: ['reseller-maps'] });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      alert(axiosErr?.response?.data?.error || 'Gagal menambah lokasi');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await api.delete(`/admin/reseller-maps/${deleteTarget.id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-reseller-maps'] });
      queryClient.invalidateQueries({ queryKey: ['reseller-maps'] });
    } catch {
      toast('Gagal menghapus lokasi', 'error');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // Supplier center (fallback to Semarang)
  const centerLat = parseFloat(
    process.env.NEXT_PUBLIC_SUPPLIER_LAT || '-6.2748',
  );
  const centerLng = parseFloat(
    process.env.NEXT_PUBLIC_SUPPLIER_LNG || '106.8672',
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Peta Reseller
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-g1 text-white rounded-xl text-sm font-bold hover:bg-g2 transition-colors"
          >
            + Tambah Lokasi
          </button>
        )}
      </div>

      {/* Map Preview */}
      {locations.length > 0 && (
        <div className="bg-white rounded-2xl border border-faint overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-faint flex items-center justify-between">
            <h3 className="font-bold text-ink text-sm">
              Pratinjau Peta ({locations.length} lokasi)
            </h3>
          </div>
          <div className="h-[280px]">
            <ResellerMap
              locations={locations}
              center={[centerLat, centerLng]}
              zoom={5}
              className="!rounded-none !border-none h-full"
            />
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-faint p-6 mb-6">
          <h3 className="font-bold text-ink mb-5">Tambah Lokasi Reseller</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Nama Toko / Reseller *
              </label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Toko Buah Segar Pak Budi"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                No. Telepon / WhatsApp
              </label>
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Alamat Lengkap *
              </label>
              <textarea
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Jl. Contoh No. 1, Kelurahan, Kecamatan, Kota, Provinsi"
                rows={2}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Latitude *{' '}
                <span className="text-muted font-normal normal-case">
                  (contoh: -6.9667)
                </span>
              </label>
              <input
                type="number"
                value={form.lat}
                onChange={(e) => set('lat', e.target.value)}
                placeholder="-6.9667"
                step="any"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Longitude *{' '}
                <span className="text-muted font-normal normal-case">
                  (contoh: 110.4167)
                </span>
              </label>
              <input
                type="number"
                value={form.lng}
                onChange={(e) => set('lng', e.target.value)}
                placeholder="110.4167"
                step="any"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Coordinate Help */}
          <div className="mb-4 p-3.5 bg-g6 rounded-xl text-xs text-muted border border-faint">
            <p className="font-bold text-ink mb-1 inline-flex items-center gap-1">
              <InfoIcon className="w-3.5 h-3.5" /> Cara mendapatkan koordinat:
            </p>
            <p>
              1. Buka{' '}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-g1 font-bold underline"
              >
                Google Maps
              </a>
            </p>
            <p>2. Cari lokasi, klik kanan pada pin</p>
            <p>3. Salin angka pertama (Latitude) dan angka kedua (Longitude)</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY_FORM);
              }}
              className="flex-1 py-2.5 bg-white border border-faint rounded-xl text-sm font-bold text-muted hover:border-g3 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-2.5 bg-g1 text-white rounded-xl text-sm font-extrabold hover:bg-g2 transition-colors disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Tambah Lokasi'}
            </button>
          </div>
        </div>
      )}

      {/* Location List */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="px-5 py-4 border-b border-faint">
          <h3 className="font-bold text-ink">
            Daftar Lokasi ({locations.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <span className="block mb-2">
              <MapPinIcon className="w-8 h-8 mx-auto" />
            </span>
            <p className="text-sm font-semibold">Belum ada lokasi reseller</p>
            <p className="text-xs mt-1">
              Tambah lokasi untuk ditampilkan di peta
            </p>
          </div>
        ) : (
          <div className="divide-y divide-faint">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="flex items-center gap-4 p-4 hover:bg-g6/30 transition-colors"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-g5 flex items-center justify-center text-lg flex-shrink-0">
                  <StoreIcon className="w-5 h-5 text-g1" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-ink">{loc.name}</p>
                  <p className="text-xs text-muted mt-0.5 truncate inline-flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5" /> {loc.address}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[0.68rem] font-mono text-muted bg-g6 px-2 py-0.5 rounded">
                      {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                    </span>
                    {loc.phone && (
                      <span className="text-[0.68rem] font-bold text-g2 inline-flex items-center gap-1">
                        <PhoneIcon className="w-3.5 h-3.5" /> {loc.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => setDeleteTarget(loc)}
                  disabled={deletingId === loc.id}
                  className="px-3 py-1.5 rounded-lg bg-red/10 text-red text-xs font-bold hover:bg-red/20 transition-all disabled:opacity-50 flex-shrink-0"
                >
                  {deletingId === loc.id ? '...' : 'Hapus'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deletingId && setDeleteTarget(null)}
        title="Konfirmasi Hapus"
        size="sm"
      >
        <p className="text-sm text-muted mb-5">
          Hapus lokasi reseller{' '}
          <span className="font-bold text-ink">
            &quot;{deleteTarget?.name}&quot;
          </span>
          ?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            disabled={!!deletingId}
            className="flex-1 py-2.5 bg-white border border-faint rounded-xl text-sm font-bold text-muted hover:border-g3 transition-all disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={!!deletingId}
            className="flex-1 py-2.5 bg-red text-white rounded-xl text-sm font-bold hover:bg-red/90 transition-colors disabled:opacity-50"
          >
            {deletingId ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
