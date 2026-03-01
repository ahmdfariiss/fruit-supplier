import { Request, Response, NextFunction } from 'express';
import * as quizService from '../services/quiz.service';
import { success } from '../helpers/response.helper';

export const getQuestions = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const questions = await quizService.getQuestions();
    success(res, questions);
  } catch (error) {
    next(error);
  }
};

export const submitQuiz = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await quizService.submitQuiz(req.user!.userId, req.body);
    success(res, result);
  } catch (error) {
    next(error);
  }
};

// Admin CRUD
export const getQuestionsAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const questions = await quizService.getQuestionsAdmin();
    success(res, questions);
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const question = await quizService.createQuestion(req.body);
    success(res, question, 'Soal quiz berhasil ditambahkan.', 201);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const question = await quizService.updateQuestion(
      req.params.id as string,
      req.body,
    );
    success(res, question, 'Soal quiz berhasil diperbarui.');
  } catch (error) {
    next(error);
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await quizService.deleteQuestion(req.params.id as string);
    success(res, null, 'Soal quiz berhasil dihapus.');
  } catch (error) {
    next(error);
  }
};
