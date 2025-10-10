
export enum QuestionCategory {
  RADIOTECNICA_1 = 'Radiotecnica 1',
  RADIOTECNICA_2 = 'Radiotecnica 2',
  RADIOTECNICA_3 = 'Radiotecnica 3',
  CODICE_Q = 'Codice Q e Abbreviazioni',
  REGOLAMENTI = 'Regolamenti',
}

export interface Question {
  id: number;
  category: QuestionCategory;
  text: string;
  options: string[];
  correctAnswer: number; // index of the correct option
}

export interface UserAnswer {
  questionId: number;
  answerIndex: number | null;
}

export type QuizState = 'start' | 'active' | 'finished';
