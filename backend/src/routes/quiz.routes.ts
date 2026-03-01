import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { submitQuizSchema } from '../validators/quiz.validator';

const router = Router();

router.get('/questions', quizController.getQuestions);
router.post(
  '/submit',
  authenticate,
  validate(submitQuizSchema),
  quizController.submitQuiz,
);

export default router;
