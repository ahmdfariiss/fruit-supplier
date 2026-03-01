'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  imageUrl: string | null;
}

export default function AdminQuizPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<QuizQuestion | null>(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-quiz'],
    queryFn: async () => {
      const { data } = await api.get('/admin/quiz');
      return data.data as QuizQuestion[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        question,
        options: options.filter((o) => o.trim()),
        correctAnswer,
        explanation,
      };
      if (editItem) {
        return api.put(`/admin/quiz/${editItem.id}`, payload);
      }
      return api.post('/admin/quiz', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quiz'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/quiz/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-quiz'] });
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditItem(null);
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(0);
    setExplanation('');
  };

  const openEdit = (item: QuizQuestion) => {
    setEditItem(item);
    setQuestion(item.question);
    setOptions(
      item.options.length >= 4
        ? item.options
        : [...item.options, ...Array(4 - item.options.length).fill('')],
    );
    setCorrectAnswer(item.correctAnswer);
    setExplanation(item.explanation);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const questions = data || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-lora text-2xl font-semibold text-ink">
          Manajemen Quiz
        </h1>
        <Button onClick={() => setShowForm(true)}>+ Tambah Pertanyaan</Button>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-faint p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-ink">
                  <span className="text-muted mr-2">{idx + 1}.</span>
                  {q.question}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`text-xs px-3 py-1.5 rounded-lg ${
                        optIdx === q.correctAnswer
                          ? 'bg-g5 text-g1 font-semibold'
                          : 'bg-sand text-muted'
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                {q.explanation && (
                  <p className="text-xs text-muted mt-2 italic">
                    {q.explanation}
                  </p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => openEdit(q)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMutation.mutate(q.id)}
                  className="text-red-500"
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <div className="text-center py-12 text-muted bg-white rounded-2xl border border-faint">
          Belum ada pertanyaan quiz
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editItem ? 'Edit Pertanyaan' : 'Tambah Pertanyaan'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Pertanyaan
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-faint bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-ink">
              Opsi Jawaban
            </label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === idx}
                  onChange={() => setCorrectAnswer(idx)}
                  className="accent-g2"
                />
                <Input
                  value={opt}
                  onChange={(e) => {
                    const next = [...options];
                    next[idx] = e.target.value;
                    setOptions(next);
                  }}
                  placeholder={`Opsi ${idx + 1}`}
                />
              </div>
            ))}
            <p className="text-xs text-muted">
              Pilih radio button untuk menandai jawaban benar
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">
              Penjelasan
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-faint bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-g3/30 focus:border-g3"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={resetForm}>
              Batal
            </Button>
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || !question}
            >
              {saveMutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
