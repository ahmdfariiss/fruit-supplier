'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDateTime } from '@/lib/formatters';
import Spinner from '@/components/ui/Spinner';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: {
    orders: number;
  };
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, page, roleFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      params.append('page', String(page));
      params.append('limit', '15');
      const { data } = await api.get(`/admin/users?${params.toString()}`);
      return data;
    },
  });

  const users: User[] = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="font-lora text-2xl font-semibold text-ink">Pengguna</h1>
        <div className="flex items-center gap-2 text-sm text-muted">
          <span className="font-semibold">Total:</span>
          <span className="font-extrabold text-ink">{pagination?.totalItems || 0}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-faint p-4 mb-5 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="🔍 Cari nama / email..."
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors"
        />
        <div className="flex gap-1.5">
          {[
            { value: '', label: 'Semua' },
            { value: 'USER', label: '👤 User' },
            { value: 'ADMIN', label: '🛡️ Admin' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => { setRoleFilter(f.value); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                roleFilter === f.value
                  ? 'bg-g1 text-white border-g1'
                  : 'bg-white text-muted border-faint hover:border-g3'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <span className="text-4xl block mb-3">👥</span>
            <p className="font-semibold">Tidak ada pengguna ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-g6 border-b border-faint">
                <tr>
                  {['Pengguna', 'Email', 'No. HP', 'Role', 'Pesanan', 'Bergabung'].map(h => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-extrabold uppercase tracking-wider text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b border-faint/60 hover:bg-g6/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
                          user.role === 'ADMIN' ? 'bg-g1 text-white' : 'bg-g5 text-g1'
                        }`}>
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-bold text-ink">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-muted">{user.email}</td>
                    <td className="py-3.5 px-4 text-muted">
                      {user.phone || <span className="text-faint">—</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        user.role === 'ADMIN'
                          ? 'bg-g1 text-white'
                          : 'bg-g5 text-g1'
                      }`}>
                        {user.role === 'ADMIN' ? '🛡️ Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-ink">{user._count?.orders ?? 0}</span>
                      <span className="text-xs text-muted ml-1">pesanan</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-muted">
                      {formatDateTime(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-faint">
            <span className="text-xs text-muted">{pagination.totalItems} pengguna</span>
            <div className="flex gap-1.5">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                className="w-8 h-8 rounded-lg border border-faint text-sm font-bold disabled:opacity-40 hover:border-g3 transition-all">‹</button>
              {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === p ? 'bg-g1 text-white' : 'border border-faint hover:border-g3'
                  }`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page >= pagination.totalPages}
                className="w-8 h-8 rounded-lg border border-faint text-sm font-bold disabled:opacity-40 hover:border-g3 transition-all">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}