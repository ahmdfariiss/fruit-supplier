'use client';

import { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/ui/Button';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizCardProps {
  question: string;
  options: QuizOption[];
  questionNumber: number;
  totalQuestions: number;
  imageUrl?: string | null;
  onAnswer: (optionId: string) => void;
  isSubmitting?: boolean;
}

export default function QuizCard({
  question,
  options,
  questionNumber,
  totalQuestions,
  imageUrl,
  onAnswer,
  isSubmitting = false,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected) {
      onAnswer(selected);
      setSelected(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-faint p-6 max-w-xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-g3 uppercase tracking-wider">
          Soal {questionNumber}/{totalQuestions}
        </span>
        <div className="flex-1 mx-4">
          <div className="h-1.5 bg-g6 rounded-full overflow-hidden">
            <div
              className="h-full bg-g3 rounded-full transition-all duration-500"
              style={{
                width: `${(questionNumber / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Image */}
      {imageUrl && (
        <div className="relative w-full h-48 rounded-2xl bg-g6 mb-4 overflow-hidden">
          <Image src={imageUrl} alt="Quiz" fill className="object-cover" />
        </div>
      )}

      {/* Question */}
      <h3 className="font-bold text-ink text-lg mb-6 leading-relaxed">
        {question}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`
              w-full text-left p-4 rounded-2xl border-2 transition-all duration-200
              text-sm font-medium
              ${
                selected === option.id
                  ? 'border-g1 bg-g6 text-g1'
                  : 'border-faint bg-white text-ink hover:border-g4 hover:bg-g6/50'
              }
            `}
          >
            {option.text}
          </button>
        ))}
      </div>

      {/* Submit */}
      <Button
        fullWidth
        onClick={handleSubmit}
        disabled={!selected}
        isLoading={isSubmitting}
      >
        {questionNumber === totalQuestions ? 'Selesai' : 'Lanjut →'}
      </Button>
    </div>
  );
}
