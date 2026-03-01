'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatRupiah, formatDate } from '@/lib/formatters';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

interface Voucher {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export default function AdminVouchersPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Voucher | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>(
    'PERCENTAGE',
  );
  const [discountValue, setDiscountValue] = useState(0);
  const [minPurchase, setMinPurchase] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState<number | ''>('');
  const [usageLimit, setUsageLimit] = useState(100);
  const [validFrom, setValidFrom] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/vouchers');
      return data.data as Voucher[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        code: code.toUpperCase(),
        discountType,
        discountValue,
        minPurchase,
        maxDiscount: maxDiscount || null,
        usageLimit,
        validFrom,
        validUntil,
      };
      if (editItem) {
        return api.put(`/admin/vouchers/${editItem.id}`, payload);
      }
      return api.post('/admin/vouchers', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/vouchers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditItem(null);
    setCode('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(0);
    setMinPurchase(0);
    setMaxDiscount('');
    setUsageLimit(100);
    setValidFrom('');
    setValidUntil('');
  };

  const openEdit = (v: Voucher) => {
    setEditItem(v);
    setCode(v.code);
    setDiscountType(v.discountType);
    setDiscountValue(v.discountValue);
    setMinPurchase(v.minPurchase);
    setMaxDiscount(v.maxDiscount ?? '');
    setUsageLimit(v.usageLimit);
    setValidFrom(v.validFrom?.slice(0, 10) || '');
    setValidUntil(v.validUntil?.slice(0, 10) || '');
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const vouchers = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Manajemen Voucher
        </h1>
        <Button onClick={() => setShowForm(true)}>+ Tambah Voucher</Button>
      </div>

      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-faint bg-sand/30">
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Kode
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Diskon
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Min. Belanja
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Penggunaan
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Berlaku
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => {
                const isExpired = new Date(v.validUntil) < new Date();
                const isFull = v.usedCount >= v.usageLimit;
                return (
                  <tr
                    key={v.id}
                    className="border-b border-faint/50 hover:bg-sand/10"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-g2">
                      {v.code}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {v.discountType === 'PERCENTAGE'
                        ? `${v.discountValue}%`
                        : formatRupiah(v.discountValue)}
                    </td>
                    <td className="py-3 px-4 text-muted">
                      {formatRupiah(v.minPurchase)}
                    </td>
                    <td className="py-3 px-4">
                      {v.usedCount}/{v.usageLimit}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted">
                      {formatDate(v.validFrom)} - {formatDate(v.validUntil)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          isExpired || isFull
                            ? 'red'
                            : v.isActive
                              ? 'green'
                              : 'yellow'
                        }
                      >
                        {isExpired
                          ? 'Kadaluarsa'
                          : isFull
                            ? 'Habis'
                            : v.isActive
                              ? 'Aktif'
                              : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(v)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMutation.mutate(v.id)}
                          className="text-red-500"
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {vouchers.length === 0 && (
          <div className="text-center py-12 text-muted">Belum ada voucher</div>
        )}
      </div>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editItem ? 'Edit Voucher' : 'Tambah Voucher'}
      >
        <div className="space-y-4">
          <Input
            label="Kode Voucher"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DISKON20"
          />

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Tipe Diskon
            </label>
            <select
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as 'PERCENTAGE' | 'FIXED')
              }
              className="w-full rounded-xl border border-faint bg-white px-4 py-3 text-sm"
            >
              <option value="PERCENTAGE">Persentase (%)</option>
              <option value="FIXED">Nominal (Rp)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nilai Diskon"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
            <Input
              label="Max. Diskon (opsional)"
              type="number"
              value={maxDiscount}
              onChange={(e) =>
                setMaxDiscount(e.target.value ? Number(e.target.value) : '')
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min. Belanja"
              type="number"
              value={minPurchase}
              onChange={(e) => setMinPurchase(Number(e.target.value))}
            />
            <Input
              label="Batas Penggunaan"
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Berlaku Dari"
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
            />
            <Input
              label="Berlaku Sampai"
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={resetForm}>
              Batal
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !code}
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
