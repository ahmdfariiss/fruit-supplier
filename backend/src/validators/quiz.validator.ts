import { z } from 'zod';

export const submitQuizSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string().uuid('ID soal tidak valid'),
        selectedIndex: z.number().int().min(0).max(3),
      }),
    )
    .min(1, 'Minimal 1 jawaban'),
});

export type SubmitQuizInput = z.infer<typeof submitQuizSchema>;
