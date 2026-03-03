'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Spinner from '@/components/ui/Spinner';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
}

const EMPTY_FORM = {
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
};

export default function AdminQuizPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-quiz'],
    queryFn: async () => {
      const { data } = await api.get('/admin/quiz');
      return data.data as QuizQuestion[];
    },
  });

  const questions = data || [];

  const handleEdit = (q: QuizQuestion) => {
    setForm({
      question: q.question,
      options: [...q.options],
      correctIndex: q.correctIndex,
      explanation: q.explanation || '',
    });
    setEditingId(q.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.question.trim()) return alert('Pertanyaan wajib diisi');
    if (form.options.some(o => !o.trim())) return alert('Semua pilihan jawaban wajib diisi');
    setSaving(true);
    try {
      const payload = {
        question: form.question,
        options: form.options,
        correctIndex: form.correctIndex,
        explanation: form.explanation || null,
      };
      if (editingId) {
        await api.put(`/admin/quiz/${editingId}`, payload);
      } else {
        await api.post('/admin/quiz', payload);
      }
      queryClient.invalidateQueries({ queryKey: ['admin-quiz'] });
      handleCancel();
    } catch {
      alert('Gagal menyimpan soal');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (q: QuizQuestion) => {
    if (!confirm(`Hapus soal "${q.question.substring(0, 50)}..."?`)) return;
    setDeletingId(q.id);
    try {
      await api.delete(`/admin/quiz/${q.id}`);
      queryClient.invalidateQueries({ queryKey: ['admin-quiz'] });
    } catch {
      alert('Gagal menghapus soal');
    } finally {
      setDeletingId(null);
    }
  };

  const setOption = (idx: number, val: string) =>
    setForm(f => ({ ...f, options: f.options.map((o, i) => i === idx ? val : o) }));

  const LABELS = ['A', 'B', 'C', 'D'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">Quiz Buah</h1>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-g1 text-white rounded-xl text-sm font-bold hover:bg-g2 transition-colors">
            + Tambah Soal
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-faint p-6 mb-6">
          <h3 className="font-bold text-ink mb-5">{editingId ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>

          <div className="mb-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Pertanyaan *</label>
            <textarea value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
              placeholder="Buah apa yang kaya vitamin C?" rows={2}
              className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors resize-none" />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-2">
              Pilihan Jawaban * <span className="text-g2 normal-case font-semibold ml-1">(klik untuk tandai jawaban benar)</span>
            </label>
            <div className="space-y-2">
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <button
                    onClick={() => setForm(f => ({ ...f, correctIndex: i }))}
                    className={`w-8 h-8 rounded-full flex-shrink-0 border-2 flex items-center justify-center text-xs font-extrabold transition-all ${
                      form.correctIndex === i
                        ? 'bg-g1 border-g1 text-white'
                        : 'border-faint text-muted hover:border-g3'
                    }`}
                  >
                    {LABELS[i]}
                  </button>
                  <input value={opt} onChange={e => setOption(i, e.target.value)}
                    placeholder={`Pilihan ${LABELS[i]}`}
                    className={`flex-1 px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors ${
                      form.correctIndex === i ? 'border-g3 bg-g6' : 'border-faint focus:border-g3'
                    }`} />
                  {form.correctIndex === i && (
                    <span className="text-xs font-bold text-g1 flex-shrink-0">✓ Benar</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-muted mb-1.5">Penjelasan (opsional)</label>
            <textarea value={form.explanation} onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
              placeholder="Jeruk mengandung vitamin C yang tinggi..."
              rows={2}
              className="w-full px-3.5 py-2.5 border border-faint rounded-xl text-sm outline-none focus:border-g3 transition-colors resize-none" />
          </div>

          <div className="flex gap-3">
            <button onClick={handleCancel}
              className="flex-1 py-2.5 bg-white border border-faint rounded-xl text-sm font-bold text-muted hover:border-g3 transition-all">
              Batal
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-[2] py-2.5 bg-g1 text-white rounded-xl text-sm font-extrabold hover:bg-g2 transition-colors disabled:opacity-50">
              {saving ? '⏳ Menyimpan...' : editingId ? '✅ Perbarui Soal' : '✅ Simpan Soal'}
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="bg-white rounded-2xl border border-faint overflow-hidden">
        <div className="px-5 py-4 border-b border-faint flex items-center justify-between">
          <h3 className="font-bold text-ink">Daftar Soal ({questions.length})</h3>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : questions.length === 0 ? (
          <div className="text-center py-12 text-muted">
            <span className="text-3xl block mb-2">🧠</span>
            <p className="text-sm font-semibold">Belum ada soal quiz</p>
          </div>
        ) : (
          <div className="divide-y divide-faint">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-7 h-7 rounded-full bg-g5 text-g1 text-xs font-extrabold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-sm text-ink leading-relaxed">{q.question}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => handleEdit(q)}
                      className="px-3 py-1.5 rounded-lg border border-faint text-xs font-bold text-muted hover:border-g3 hover:text-g1 transition-all">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(q)} disabled={deletingId === q.id}
                      className="px-3 py-1.5 rounded-lg bg-red/10 text-red text-xs font-bold hover:bg-red/20 transition-all disabled:opacity-50">
                      {deletingId === q.id ? '...' : 'Hapus'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 ml-10">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 ${
                      i === q.correctIndex ? 'bg-g5 text-g1 font-bold' : 'bg-g6 text-muted'
                    }`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[0.6rem] font-extrabold flex-shrink-0 ${
                        i === q.correctIndex ? 'bg-g1 text-white' : 'bg-faint text-muted'
                      }`}>{LABELS[i]}</span>
                      {opt}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <p className="ml-10 mt-2 text-xs text-muted italic">💡 {q.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}