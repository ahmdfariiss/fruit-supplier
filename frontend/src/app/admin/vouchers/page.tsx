'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDateTime } from '@/lib/formatters';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { TicketIcon } from '@/components/ui/icons';

interface Voucher {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minOrder: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

const normalizeVoucher = (item: Record<string, unknown>): Voucher => ({
  id: String(item.id),
  code: String(item.code ?? ''),
  type: (item.type ?? item.discountType ?? 'PERCENTAGE') as
    | 'PERCENTAGE'
    | 'FIXED',
  value: Number(item.value ?? item.discountValue ?? 0),
  minOrder: Number(item.minOrder ?? item.minPurchase ?? 0),
  maxDiscount:
    item.maxDiscount === null || item.maxDiscount === undefined
      ? null
      : Number(item.maxDiscount),
  usageLimit:
    item.usageLimit === null || item.usageLimit === undefined
      ? null
      : Number(item.usageLimit),
  usageCount: Number(item.usageCount ?? item.usedCount ?? 0),
  isActive: Boolean(item.isActive),
  expiresAt: (item.expiresAt ?? item.validUntil ?? null) as string | null,
  createdAt: String(item.createdAt ?? ''),
});

const EMPTY_FORM = {
  code: '',
  type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
  value: '',
  minOrder: '0',
  maxDiscount: '',
  usageLimit: '',
  expiresAt: '',
};

export default function AdminVouchersPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Voucher | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vouchers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/vouchers');
      return (data.data as Record<string, unknown>[]).map(normalizeVoucher);
    },
  });

  const vouchers = data || [];

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    const code = Array.from(
      { length: 8 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    setForm((f) => ({ ...f, code }));
  };

  const handleSave = async () => {
    if (!form.code.trim()) return alert('Kode voucher wajib diisi');
    if (!form.value || Number(form.value) <= 0)
      return alert('Nilai voucher wajib diisi');
    setSaving(true);
    try {
      await api.post('/admin/vouchers', {
        code: form.code.toUpperCase(),
        discountType: form.type,
        discountValue: Number(form.value),
        minPurchase: Number(form.minOrder) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        validUntil: form.expiresAt || null,
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await api.delete(`/admin/vouchers/${deleteTarget.id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-vouchers'] });
    } catch {
      toast('Gagal menghapus voucher', 'error');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const set = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Kode Voucher *
              </label>
              <div className="flex gap-2">
                <input
                  value={form.code}
                  onChange={(e) => set('code', e.target.value.toUpperCase())}
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
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Tipe Diskon *
              </label>
              <div className="flex gap-2">
                {(['PERCENTAGE', 'FIXED'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => set('type', t)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      form.type === t
                        ? 'bg-g1 text-white border-g1'
                        : 'border-faint text-muted hover:border-g3'
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
                Nilai Diskon * {form.type === 'PERCENTAGE' ? '(%)' : '(Rp)'}
              </label>
              <input
                type="number"
                value={form.value}
                onChange={(e) => set('value', e.target.value)}
                placeholder={form.type === 'PERCENTAGE' ? '10' : '15000'}
                min="0"
                max={form.type === 'PERCENTAGE' ? '100' : undefined}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>

            {/* Min Order */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Min. Belanja (Rp)
              </label>
              <input
                type="number"
                value={form.minOrder}
                onChange={(e) => set('minOrder', e.target.value)}
                placeholder="50000"
                min="0"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>

            {/* Max Discount (only for percentage) */}
            {form.type === 'PERCENTAGE' && (
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                  Maks. Diskon (Rp, opsional)
                </label>
                <input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => set('maxDiscount', e.target.value)}
                  placeholder="30000"
                  min="0"
                  className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
                />
              </div>
            )}

            {/* Usage Limit */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Batas Pemakaian (kosong = unlimited)
              </label>
              <input
                type="number"
                value={form.usageLimit}
                onChange={(e) => set('usageLimit', e.target.value)}
                placeholder="100"
                min="1"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>

            {/* Expires At */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">
                Tanggal Kedaluwarsa (opsional)
              </label>
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(e) => set('expiresAt', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
              />
            </div>
          </div>

          {/* Preview */}
          {form.code && form.value && (
            <div className="mb-5 p-4 bg-g6 rounded-xl border border-faint">
              <p className="text-xs font-extrabold text-muted uppercase tracking-wider mb-1">
                Preview Voucher
              </p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-extrabold text-g1 tracking-widest bg-white px-4 py-2 rounded-xl border border-g4">
                  {form.code}
                </span>
                <div className="text-sm">
                  <p className="font-bold text-ink">
                    Diskon{' '}
                    {form.type === 'PERCENTAGE'
                      ? `${form.value}%`
                      : `Rp ${Number(form.value).toLocaleString('id-ID')}`}
                    {form.maxDiscount &&
                      form.type === 'PERCENTAGE' &&
                      ` (maks. Rp ${Number(form.maxDiscount).toLocaleString('id-ID')})`}
                  </p>
                  {Number(form.minOrder) > 0 && (
                    <p className="text-xs text-muted">
                      Min. belanja Rp{' '}
                      {Number(form.minOrder).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

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
              {saving ? 'Menyimpan...' : 'Buat Voucher'}
            </button>
          </div>
        </div>
      )}

      {/* Voucher List */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="px-5 py-4 border-b border-faint flex items-center justify-between">
          <h3 className="font-bold text-ink">
            Daftar Voucher ({vouchers.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <span className="text-3xl block mb-2">
              <TicketIcon className="w-8 h-8 mx-auto" />
            </span>
            <p className="text-sm font-semibold">Belum ada voucher</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-g6 border-b border-faint">
                <tr>
                  {[
                    'Kode',
                    'Diskon',
                    'Min. Belanja',
                    'Pemakaian',
                    'Berlaku',
                    'Status',
                    'Aksi',
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vouchers.map((v) => {
                  const isExpired =
                    v.expiresAt && new Date(v.expiresAt) < new Date();
                  const isExhausted =
                    v.usageLimit !== null && v.usageCount >= v.usageLimit;
                  return (
                    <tr
                      key={v.id}
                      className="border-b border-faint/60 hover:bg-g6/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-g1 tracking-widest bg-g5 px-2.5 py-1 rounded-lg text-xs">
                          {v.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        {v.type === 'PERCENTAGE'
                          ? `${v.value ?? 0}%${v.maxDiscount ? ` (maks. Rp ${Number(v.maxDiscount).toLocaleString('id-ID')})` : ''}`
                          : `Rp ${Number(v.value ?? 0).toLocaleString('id-ID')}`}
                      </td>
                      <td className="py-3.5 px-4 text-muted">
                        {(v.minOrder ?? 0) > 0
                          ? `Rp ${Number(v.minOrder).toLocaleString('id-ID')}`
                          : '-'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-xs font-bold ${isExhausted ? 'text-red' : 'text-ink'}`}
                        >
                          {v.usageCount}/{v.usageLimit ?? '∞'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted">
                        {v.expiresAt ? (
                          <span
                            className={isExpired ? 'text-red font-bold' : ''}
                          >
                            {formatDateTime(v.expiresAt)}
                          </span>
                        ) : (
                          '∞ Tidak ada'
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggle(v)}
                          disabled={togglingId === v.id}
                          className={`w-10 h-6 rounded-full transition-all relative ${
                            v.isActive && !isExpired && !isExhausted
                              ? 'bg-g1'
                              : 'bg-faint'
                          } disabled:opacity-50`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                              v.isActive ? 'left-5' : 'left-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setDeleteTarget(v)}
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

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => !deletingId && setDeleteTarget(null)}
        title="Konfirmasi Hapus"
        size="sm"
      >
        <p className="text-sm text-muted mb-5">
          Hapus voucher{' '}
          <span className="font-bold text-ink">
            &quot;{deleteTarget?.code}&quot;
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
