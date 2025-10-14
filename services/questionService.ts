import { Question, QuestionCategory } from '../types';
import { TECHNICAL_CATEGORIES, OTHER_CATEGORIES, TECHNICAL_QUESTIONS_COUNT, OTHER_QUESTIONS_COUNT } from '../constants';

import radiotecnica1Data from '../data/radiotecnica1';
import radiotecnica2Data from '../data/radiotecnica2';
import radiotecnica3Data from '../data/radiotecnica3';
import codiceQData from '../data/codiceQ';
import regolamentiData from '../data/regolamenti';
import { explanations } from '../data/explanations';

let questionIdCounter = 1;

function parseQuestions(rawText: string, category: QuestionCategory): Question[] {
    const questions: Question[] = [];

    // Split the text into blocks, where each block starts with "Domanda N. ..."
    const questionBlocks = rawText.trim().split(/(?=Domanda N\. \d+)/);

    for (const block of questionBlocks) {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) continue;

        const lines = trimmedBlock.split('\n').map(line => line.trim());
        
        try {
            // Line 0 can be "Domanda N. X"
            // The next line should be the question text
            const textIndex = lines.findIndex(line => !line.startsWith('Domanda N.'));
            if (textIndex === -1) continue;
            
            const text = lines[textIndex];
            
            // The next 4 lines should be the options
            const options = lines.slice(textIndex + 1, textIndex + 5).map(opt => opt.substring(2).trim());
            
            // The last line should be the answer
            const correctLine = lines.find(l => l.startsWith('Risposta:'));
            
            if (!text || options.length !== 4 || !options.every(o => o) || !correctLine) {
                 console.warn('Blocco domanda malformato, saltato:', trimmedBlock);
                 continue;
            }

            const correctLetter = correctLine.replace('Risposta:', '').trim().toUpperCase();
            const correctAnswer = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
            
            const newId = questionIdCounter++;
            const explanation = explanations[newId] || 'La spiegazione per questa domanda sarà disponibile a breve.';

            if (correctAnswer >= 0 && correctAnswer <= 3) {
                questions.push({
                    id: newId,
                    category,
                    text,
                    options,
                    correctAnswer,
                    explanation,
                });
            } else {
                 console.warn('Blocco domanda con risposta non valida, saltato:', trimmedBlock);
            }
        } catch (error) {
            console.error('Errore durante il parsing del blocco domanda:', trimmedBlock, error);
        }
    }
    return questions;
}


const ALL_QUESTIONS: Question[] = [
    ...parseQuestions(radiotecnica1Data, QuestionCategory.RADIOTECNICA_1),
    ...parseQuestions(radiotecnica2Data, QuestionCategory.RADIOTECNICA_2),
    ...parseQuestions(radiotecnica3Data, QuestionCategory.RADIOTECNICA_3),
    ...parseQuestions(codiceQData, QuestionCategory.CODICE_Q),
    ...parseQuestions(regolamentiData, QuestionCategory.REGOLAMENTI),
];


function shuffleArray<T,>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export const getQuestionCountByCategory = (category: QuestionCategory): number => {
  return ALL_QUESTIONS.filter(q => q.category === category).length;
};


export const getQuestionsByCategory = (category: QuestionCategory, count: number | 'all'): Question[] => {
  const categoryQuestions = ALL_QUESTIONS.filter(q => q.category === category);
  const shuffled = shuffleArray(categoryQuestions);
  
  if (count === 'all') {
    return shuffled;
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getQuizQuestions = (): Question[] => {
  const technicalQuestions = ALL_QUESTIONS.filter(q => TECHNICAL_CATEGORIES.includes(q.category));
  const otherQuestions = ALL_QUESTIONS.filter(q => OTHER_CATEGORIES.includes(q.category));

  const shuffledTechnical = shuffleArray(technicalQuestions).slice(0, TECHNICAL_QUESTIONS_COUNT);
  const shuffledOther = shuffleArray(otherQuestions).slice(0, OTHER_QUESTIONS_COUNT);

  const finalQuiz = shuffleArray([...shuffledTechnical, ...shuffledOther]);
  return finalQuiz;
};