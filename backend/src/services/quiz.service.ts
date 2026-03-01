import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { nanoid } from 'nanoid';
import { env } from '../config/env';
import type { SubmitQuizInput } from '../validators/quiz.validator';

// Public: returns questions WITHOUT correctIndex
export const getQuestions = async () => {
  return prisma.quizQuestion.findMany({
    select: {
      id: true,
      question: true,
      options: true,
      // Do NOT send correctIndex to client
    },
  });
};

// Admin: returns questions WITH correctIndex + explanation
export const getQuestionsAdmin = async () => {
  const questions = await prisma.quizQuestion.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return questions.map((q: any) => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctIndex,
    explanation: q.explanation,
    imageUrl: null,
    createdAt: q.createdAt,
  }));
};

export const createQuestion = async (data: {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}) => {
  return prisma.quizQuestion.create({
    data: {
      question: data.question,
      options: data.options,
      correctIndex: data.correctAnswer,
      explanation: data.explanation || null,
    },
  });
};

export const updateQuestion = async (
  id: string,
  data: {
    question?: string;
    options?: string[];
    correctAnswer?: number;
    explanation?: string;
  },
) => {
  const question = await prisma.quizQuestion.findUnique({ where: { id } });
  if (!question) {
    throw new AppError('Soal quiz tidak ditemukan.', 404);
  }

  const updateData: any = {};
  if (data.question !== undefined) updateData.question = data.question;
  if (data.options !== undefined) updateData.options = data.options;
  if (data.correctAnswer !== undefined)
    updateData.correctIndex = data.correctAnswer;
  if (data.explanation !== undefined) updateData.explanation = data.explanation;

  return prisma.quizQuestion.update({ where: { id }, data: updateData });
};

export const deleteQuestion = async (id: string) => {
  const question = await prisma.quizQuestion.findUnique({ where: { id } });
  if (!question) {
    throw new AppError('Soal quiz tidak ditemukan.', 404);
  }
  return prisma.quizQuestion.delete({ where: { id } });
};

export const submitQuiz = async (userId: string, input: SubmitQuizInput) => {
  const questions = await prisma.quizQuestion.findMany();

  let correct = 0;
  const results = input.answers.map((answer) => {
    const question = questions.find((q: any) => q.id === answer.questionId);
    if (!question) return { questionId: answer.questionId, correct: false };

    const isCorrect = question.correctIndex === answer.selectedIndex;
    if (isCorrect) correct++;

    return {
      questionId: answer.questionId,
      correct: isCorrect,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
    };
  });

  const score = correct;
  const total = questions.length;
  const isPerfect = score === total;

  let voucherCode: string | null = null;

  if (isPerfect) {
    // Check if user already has a quiz voucher
    const existingVouchers = await prisma.userVoucher.findMany({
      where: { userId },
      include: { voucher: true },
    });

    const hasQuizVoucher = existingVouchers.length > 0;

    if (hasQuizVoucher) {
      throw new AppError('Kamu sudah mendapat voucher dari quiz ini.', 400);
    }

    // Generate voucher
    voucherCode = `QUIZ-${nanoid(8).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + env.QUIZ_VOUCHER_EXPIRES_DAYS);

    const voucher = await prisma.voucher.create({
      data: {
        code: voucherCode,
        discountType: 'PERCENTAGE',
        discountValue: env.QUIZ_VOUCHER_DISCOUNT,
        usageLimit: 1,
        validUntil: expiresAt,
      },
    });

    await prisma.userVoucher.create({
      data: { userId, voucherId: voucher.id },
    });
  }

  return {
    score,
    total,
    isPerfect,
    voucherCode,
    results,
  };
};
