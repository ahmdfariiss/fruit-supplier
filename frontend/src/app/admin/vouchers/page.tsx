'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDateTime } from '@/lib/formatters';
import Spinner from '@/components/ui/Spinner';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';

interface Voucher {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minPurchase: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  validUntil: string | null;
  createdAt: string;
}

const EMPTY_FORM = {
  code: '',
  discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
  discountValue: '',
  minPurchase: '0',
  maxDiscount: '',
  usageLimit: '',
  validUntil: '',
};

export default function AdminVouchersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Voucher | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/vouchers');
      return data.data as Voucher[];
    },
  });

  const vouchers = data || [];

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    const code = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    setForm(f => ({ ...f, code }));
  };

  const handleSave = async () => {
    if (!form.code.trim()) return alert('Kode voucher wajib diisi');
    if (!form.discountValue || Number(form.discountValue) <= 0) return alert('Nilai voucher wajib diisi');
    setSaving(true);
    try {
      await api.post('/admin/vouchers', {
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minPurchase: Number(form.minPurchase) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        validUntil: form.validUntil || null,
      });
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      alert(axiosErr?.response?.data?.error || 'Gagal membuat voucher');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (v: Voucher) => {
    setTogglingId(v.id);
    try {
      await api.patch(`/admin/vouchers/${v.id}`, { isActive: !v.isActive });
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
    } catch {
      alert('Gagal mengubah status voucher');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (v: Voucher) => {
    setDeleteTarget(v);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await api.delete(`/admin/vouchers/${deleteTarget.id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
    } catch {
      alert('Gagal menghapus voucher');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">Voucher</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-g1 text-white rounded-xl text-sm font-bold hover:bg-g2 transition-colors"
          >
            + Buat Voucher
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-faint p-6 mb-6">
          <h3 className="font-bold text-ink mb-5">Buat Voucher Baru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Code */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Kode Voucher *</label>
              <div className="flex gap-2">
                <input
                  value={form.code}
                  onChange={e => set('code', e.target.value.toUpperCase())}
                  placeholder="BUAH50"
                  className="flex-1 px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 font-mono tracking-widest"
                />
                <button
                  onClick={generateCode}
                  className="px-3 py-2.5 border border-faint rounded-xl text-xs font-bold text-muted hover:border-g3 hover:text-g1 transition-all"
                >
                  🎲 Auto
                </button>
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Tipe Diskon *</label>
              <div className="flex gap-2">
                {(['PERCENTAGE', 'FIXED'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => set('discountType', t)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      form.discountType === t ? 'bg-g1 text-white border-g1' : 'border-faint text-muted hover:border-g3'
                    }`}
                  >
                    {t === 'PERCENTAGE' ? '% Persentase' : 'Rp Nominal'}
                  </button>
                ))}
              </div>
            </div>

            {/* Value */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Nilai Diskon * {form.discountType === 'PERCENTAGE' ? '(%)' : '(Rp)'}
              </label>
              <input
                type="number"
                value={form.discountValue}
                onChange={e => set('discountValue', e.target.value)}
                placeholder={form.discountType === 'PERCENTAGE' ? '10' : '15000'}
                min="0"
                max={form.discountType === 'PERCENTAGE' ? '100' : undefined}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>

            {/* Min Order */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Min. Belanja (Rp)</label>
              <input
                type="number"
                value={form.minPurchase}
                onChange={e => set('minPurchase', e.target.value)}
                placeholder="50000"
                min="0"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>

            {/* Max Discount (only for percentage) */}
            {form.discountType === 'PERCENTAGE' && (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Maks. Diskon (Rp, opsional)</label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={e => set('maxDiscount', e.target.value)}
                  placeholder="30000"
                  min="0"
                  className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
                />
              </div>
            )}

            {/* Usage Limit */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Batas Pemakaian (kosong = unlimited)</label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={e => set('usageLimit', e.target.value)}
                placeholder="100"
                min="1"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Tanggal Kedaluwarsa (opsional)</label>
              <input
                type="datetime-local"
                value={form.validUntil}
                onChange={e => set('validUntil', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>
          </div>

          {/* Preview */}
          {form.code && form.discountValue && (
            <div className="mb-5 p-4 bg-g6 rounded-xl border border-faint">
              <p className="text-xs font-extrabold text-muted uppercase tracking-wider mb-1">Preview Voucher</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-extrabold text-g1 tracking-widest bg-white px-4 py-2 rounded-xl border border-g4">
                  {form.code}
                </span>
                <div className="text-sm">
                  <p className="font-bold text-ink">
                    Diskon {form.discountType === 'PERCENTAGE' ? `${form.discountValue}%` : `Rp ${Number(form.discountValue).toLocaleString('id-ID')}`}
                    {form.maxDiscount && form.discountType === 'PERCENTAGE' && ` (maks. Rp ${Number(form.maxDiscount).toLocaleString('id-ID')})`}
                  </p>
                  {Number(form.minPurchase) > 0 && (
                    <p className="text-xs text-muted">Min. belanja Rp {Number(form.minPurchase).toLocaleString('id-ID')}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
              className="flex-1 py-2.5 bg-white border border-faint rounded-xl text-sm font-bold text-muted hover:border-g3 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-2.5 bg-g1 text-white rounded-xl text-sm font-extrabold hover:bg-g2 transition-colors disabled:opacity-50"
            >
              {saving ? '⏳ Menyimpan...' : '🎟️ Buat Voucher'}
            </button>
          </div>
        </div>
      )}

      {/* Voucher List */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="px-5 py-4 border-b border-faint flex items-center justify-between">
          <h3 className="font-bold text-ink">Daftar Voucher ({vouchers.length})</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <span className="text-3xl block mb-2">🎟️</span>
            <p className="text-sm font-semibold">Belum ada voucher</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-g6 border-b border-faint">
                <tr>
                  {['Kode', 'Diskon', 'Min. Belanja', 'Pemakaian', 'Berlaku', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vouchers.map(v => {
                  const isExpired = v.validUntil && new Date(v.validUntil) < new Date();
                  const isExhausted = v.usageLimit !== null && v.usedCount >= v.usageLimit;
                  return (
                    <tr key={v.id} className="border-b border-faint/60 hover:bg-g6/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-g1 tracking-widest bg-g5 px-2.5 py-1 rounded-lg text-xs">
                          {v.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {v.discountType === 'PERCENTAGE'
                          ? `${v.discountValue ?? 0}%${v.maxDiscount ? ` (maks. Rp ${Number(v.maxDiscount).toLocaleString('id-ID')})` : ''}`
                          : `Rp ${Number(v.discountValue ?? 0).toLocaleString('id-ID')}`
                        }
                      </td>
                      <td className="py-3.5 px-4 text-muted">
                        {(v.minPurchase ?? 0) > 0 ? `Rp ${Number(v.minPurchase).toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-xs font-bold ${isExhausted ? 'text-red' : 'text-ink'}`}>
                          {v.usedCount}/{v.usageLimit ?? '∞'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted">
                        {v.validUntil
                          ? <span className={isExpired ? 'text-red font-bold' : ''}>{formatDateTime(v.validUntil)}</span>
                          : '∞ Tidak ada'}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggle(v)}
                          disabled={togglingId === v.id}
                          className={`w-10 h-6 rounded-full transition-all relative ${
                            v.isActive && !isExpired && !isExhausted ? 'bg-g1' : 'bg-faint'
                          } disabled:opacity-50`}
                        >
                          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                            v.isActive ? 'left-5' : 'left-1'
                          }`} />
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleDelete(v)}
                          disabled={deletingId === v.id}
                          className="px-3 py-1.5 rounded-lg bg-red/10 text-red text-xs font-bold hover:bg-red/20 transition-all disabled:opacity-50"
                        >
                          {deletingId === v.id ? '...' : 'Hapus'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        message={`Hapus voucher "${deleteTarget?.code}"?`}
        loading={!!deletingId}
      />
    </div>
  );
}