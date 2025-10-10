
import { QuestionCategory } from './types';

export const TOTAL_QUESTIONS = 50;
export const TECHNICAL_QUESTIONS_COUNT = 30;
export const OTHER_QUESTIONS_COUNT = 20;

export const TECHNICAL_CATEGORIES: QuestionCategory[] = [
  QuestionCategory.RADIOTECNICA_1,
  QuestionCategory.RADIOTECNICA_2,
  QuestionCategory.RADIOTECNICA_3,
];

export const OTHER_CATEGORIES: QuestionCategory[] = [
  QuestionCategory.CODICE_Q,
  QuestionCategory.REGOLAMENTI,
];

export const PASSING_SCORE_PERCENTAGE = 60;
