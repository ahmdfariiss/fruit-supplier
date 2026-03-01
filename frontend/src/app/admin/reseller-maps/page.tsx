'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

interface ResellerLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone: string | null;
  isActive: boolean;
}

export default function AdminResellerMapsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<ResellerLocation | null>(null);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [phone, setPhone] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reseller-maps'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reseller-maps');
      return data.data as ResellerLocation[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name,
        address,
        city,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        phone: phone || null,
      };
      if (editItem) {
        return api.put(`/admin/reseller-maps/${editItem.id}`, payload);
      }
      return api.post('/admin/reseller-maps', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reseller-maps'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/reseller-maps/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reseller-maps'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditItem(null);
    setName('');
    setAddress('');
    setCity('');
    setLat('');
    setLng('');
    setPhone('');
  };

  const openEdit = (loc: ResellerLocation) => {
    setEditItem(loc);
    setName(loc.name);
    setAddress(loc.address);
    setCity(loc.city);
    setLat(String(loc.lat));
    setLng(String(loc.lng));
    setPhone(loc.phone || '');
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const locations = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Peta Reseller
        </h1>
        <Button onClick={() => setShowForm(true)}>+ Tambah Lokasi</Button>
      </div>

      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-faint bg-sand/30">
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Nama
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Kota
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Alamat
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Koordinat
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr
                  key={loc.id}
                  className="border-b border-faint/50 hover:bg-sand/10"
                >
                  <td className="py-3 px-4 font-semibold">{loc.name}</td>
                  <td className="py-3 px-4 text-muted">{loc.city}</td>
                  <td className="py-3 px-4 text-muted text-xs max-w-[200px] truncate">
                    {loc.address}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-muted">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(loc)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMutation.mutate(loc.id)}
                        className="text-red-500"
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12 text-muted">
            Belum ada lokasi reseller
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editItem ? 'Edit Lokasi' : 'Tambah Lokasi'}
      >
        <div className="space-y-4">
          <Input
            label="Nama Reseller"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Kota"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Alamat
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-faint bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="-6.2088"
            />
            <Input
              label="Longitude"
              type="number"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="106.8456"
            />
          </div>
          <Input
            label="Telepon (opsional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={resetForm}>
              Batal
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !name || !lat || !lng}
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
