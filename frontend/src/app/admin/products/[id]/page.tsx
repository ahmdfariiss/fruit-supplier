'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import ImageUpload from '@/components/ui/ImageUpload';
import Spinner from '@/components/ui/Spinner';
import type { Category } from '@/types/product';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const EMPTY_FORM = {
  name: '', description: '', categoryId: '',
  priceConsumer: '', priceReseller: '', minOrderReseller: '1',
  stock: '', unit: 'kg', isFeatured: false,
  seasonStart: '', seasonEnd: '', tags: '',
};

export default function AdminProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const isNew = params.id === 'new';

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data as Category[];
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['admin-product', params.id],
    queryFn: async () => {
      const { data } = await api.get(`/admin/products/${params.id}`);
      return data.data;
    },
    enabled: !isNew && !!params.id,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        priceConsumer: String(product.priceConsumer || ''),
        priceReseller: String(product.priceReseller || ''),
        minOrderReseller: String(product.minOrderReseller || '1'),
        stock: String(product.stock || ''),
        unit: product.unit || 'kg',
        isFeatured: product.isFeatured || false,
        seasonStart: product.seasonStart != null ? String(product.seasonStart) : '',
        seasonEnd: product.seasonEnd != null ? String(product.seasonEnd) : '',
        tags: (product.tags || []).join(', '),
      });
    }
  }, [product]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.categoryId) e.categoryId = 'Kategori wajib dipilih';
    if (!form.priceConsumer || Number(form.priceConsumer) <= 0) e.priceConsumer = 'Harga konsumen wajib diisi';
    if (!form.priceReseller || Number(form.priceReseller) <= 0) e.priceReseller = 'Harga reseller wajib diisi';
    if (!form.stock || Number(form.stock) < 0) e.stock = 'Stok wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'tags') {
          const tagsArr = String(val).split(',').map(t => t.trim()).filter(Boolean);
          tagsArr.forEach(t => formData.append('tags[]', t));
        } else if (key === 'seasonStart' || key === 'seasonEnd') {
          if (String(val)) formData.append(key, String(val));
        } else {
          formData.append(key, String(val));
        }
      });
      if (imageFile) formData.append('image', imageFile);

      if (isNew) {
        await api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.put(`/admin/products/${params.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/admin/products');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      alert(axiosErr?.response?.data?.error || 'Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, val: unknown) => setForm(f => ({ ...f, [key]: val }));

  const inputCls = (field: string) =>
    `w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
      errors[field] ? 'border-red focus:border-red' : 'border-faint focus:border-g3'
    }`;

  if (!isNew && isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/admin/products')} className="text-sm text-muted hover:text-g1 font-semibold transition-colors">
          ← Produk
        </button>
        <h1 className="font-lora text-xl font-semibold text-ink">
          {isNew ? 'Tambah Produk Baru' : `Edit: ${product?.name || ''}`}
        </h1>
      </div>

      <div className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-faint p-6">
          <h3 className="font-bold text-ink mb-5">Informasi Dasar</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Nama Produk *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Contoh: Mangga Harum Manis" className={inputCls('name')} />
              {errors.name && <p className="text-xs text-red mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Deskripsi</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Deskripsi produk..." rows={3}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Kategori *</label>
                <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} className={inputCls('categoryId')}>
                  <option value="">Pilih kategori...</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-xs text-red mt-1">{errors.categoryId}</p>}
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Satuan *</label>
                <select value={form.unit} onChange={e => set('unit', e.target.value)} className={inputCls('unit')}>
                  {['kg', 'gram', 'buah', 'ikat', 'box', 'lusin', 'liter'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Tags (pisah dengan koma)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="segar, premium, organik"
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-faint p-6">
          <h3 className="font-bold text-ink mb-5">Harga & Stok</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Harga Konsumen (Rp) *</label>
              <input type="number" value={form.priceConsumer} onChange={e => set('priceConsumer', e.target.value)}
                placeholder="15000" className={inputCls('priceConsumer')} min="0" />
              {errors.priceConsumer && <p className="text-xs text-red mt-1">{errors.priceConsumer}</p>}
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Harga Reseller (Rp) *</label>
              <input type="number" value={form.priceReseller} onChange={e => set('priceReseller', e.target.value)}
                placeholder="12000" className={inputCls('priceReseller')} min="0" />
              {errors.priceReseller && <p className="text-xs text-red mt-1">{errors.priceReseller}</p>}
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Min. Order Reseller</label>
              <input type="number" value={form.minOrderReseller} onChange={e => set('minOrderReseller', e.target.value)}
                placeholder="10" className={inputCls('minOrderReseller')} min="1" />
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Stok ({form.unit}) *</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)}
                placeholder="100" className={inputCls('stock')} min="0" />
              {errors.stock && <p className="text-xs text-red mt-1">{errors.stock}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 p-3 bg-g6 rounded-xl">
            <button
              onClick={() => set('isFeatured', !form.isFeatured)}
              className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${form.isFeatured ? 'bg-g1' : 'bg-faint'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isFeatured ? 'left-5' : 'left-1'}`} />
            </button>
            <div>
              <p className="text-sm font-bold text-ink">Tampilkan di Beranda (Unggulan)</p>
              <p className="text-xs text-muted">Produk akan muncul di section Featured Products</p>
            </div>
          </div>
        </div>

        {/* Season */}
        <div className="bg-white rounded-2xl border border-faint p-6">
          <h3 className="font-bold text-ink mb-2">Musim Panen</h3>
          <p className="text-xs text-muted mb-4">Kosongkan jika produk tersedia sepanjang tahun</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Bulan Mulai</label>
              <select value={form.seasonStart} onChange={e => set('seasonStart', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3">
                <option value="">Tidak ada</option>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Bulan Selesai</label>
              <select value={form.seasonEnd} onChange={e => set('seasonEnd', e.target.value)}
                className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3">
                <option value="">Tidak ada</option>
                {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white rounded-2xl border border-faint p-6">
          <h3 className="font-bold text-ink mb-4">Foto Produk</h3>
          {!isNew && product?.imageUrl && !imageFile && (
            <div className="mb-3 relative w-24 h-24 rounded-xl overflow-hidden border border-faint">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              <p className="text-xs text-muted mt-2">Foto saat ini</p>
            </div>
          )}
          <ImageUpload
            value={!isNew && product?.imageUrl && !imageFile ? product.imageUrl : undefined}
            onChange={setImageFile}
            accept="image/jpeg,image/png,image/webp"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/products')}
            className="flex-1 py-3 bg-white text-ink border border-faint rounded-xl text-sm font-bold hover:border-g3 hover:text-g1 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-[2] py-3 bg-g1 text-white rounded-xl text-sm font-extrabold hover:bg-g2 transition-colors disabled:opacity-50"
          >
            {saving ? '⏳ Menyimpan...' : isNew ? '✅ Simpan Produk' : '✅ Perbarui Produk'}
          </button>
        </div>
      </div>
    </div>
  );
}