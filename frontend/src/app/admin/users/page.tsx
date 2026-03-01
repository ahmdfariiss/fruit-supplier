'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'BUYER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', {
        params: { page, limit: 15 },
      });
      return data;
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/users/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteTarget(null);
    },
  });

  const users: User[] = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-lora text-2xl font-semibold text-ink mb-6">
        Manajemen Pengguna
      </h1>

      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-faint bg-sand/30">
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Nama
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Email
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Telepon
                </th>
                <th className="text-left py-3 px-4 font-semibold text-muted text-xs uppercase">
                  Role
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
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-faint/50 hover:bg-sand/10"
                >
                  <td className="py-3 px-4 font-semibold">{user.name}</td>
                  <td className="py-3 px-4 text-muted">{user.email}</td>
                  <td className="py-3 px-4 text-muted">{user.phone || '-'}</td>
                  <td className="py-3 px-4">
                    <Badge variant={user.role === 'ADMIN' ? 'blue' : 'green'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleMutation.mutate({
                            id: user.id,
                            isActive: !user.isActive,
                          })
                        }
                      >
                        {user.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                      {user.role !== 'ADMIN' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(user)}
                          className="text-red-500"
                        >
                          Hapus
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-muted">Tidak ada pengguna</div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Hapus Pengguna"
      >
        <p className="text-sm text-muted mb-4">
          Apakah Anda yakin ingin menghapus pengguna{' '}
          <strong>{deleteTarget?.name}</strong>?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button
            onClick={() =>
              deleteTarget && deleteMutation.mutate(deleteTarget.id)
            }
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
