import React, { useMemo, useEffect, useState } from 'react';
import { Question, UserAnswer } from '../types';
import { PASSING_SCORE_PERCENTAGE } from '../constants';
import { RadioWaveIcon } from './icons/RadioWaveIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { getIncorrectQuestionIds, saveIncorrectQuestionIds } from '../services/storageService';
import { generateExplanation } from '../services/aiService';


interface ResultsScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
  title: string;
  isPracticeMode: boolean;
  isStudyMode: boolean;
  isReviewMode: boolean;
}

const PDF_ELEMENT_ID = 'pdf-results';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart, title, isPracticeMode, isReviewMode }) => {
  const [explanations, setExplanations] = useState<Record<number, string>>({});
  const [loadingExplanations, setLoadingExplanations] = useState<Record<number, boolean>>({});

  const { score, correctAnswers, incorrectAnswers, isPassed } = useMemo(() => {
    if (questions.length === 0) {
      return { score: 0, correctAnswers: 0, incorrectAnswers: 0, isPassed: false };
    }
    let correctCount = 0;
    questions.forEach(q => {
      const userAnswer = userAnswers.find(a => a.questionId === q.id);
      if (userAnswer?.answerIndex === q.correctAnswer) {
        correctCount++;
      }
    });
    const scorePercentage = (correctCount / questions.length) * 100;
    return {
      score: correctCount,
      correctAnswers: correctCount,
      incorrectAnswers: questions.length - correctCount,
      isPassed: scorePercentage >= PASSING_SCORE_PERCENTAGE,
    };
  }, [questions, userAnswers]);

  const categoryStats = useMemo(() => {
    if (questions.length === 0) return [];
    
    const stats: Record<string, { correct: number; total: number }> = {};

    questions.forEach(q => {
        if (!stats[q.category]) {
            stats[q.category] = { correct: 0, total: 0 };
        }
        stats[q.category].total++;

        const userAnswer = userAnswers.find(a => a.questionId === q.id);
        if (userAnswer?.answerIndex === q.correctAnswer) {
            stats[q.category].correct++;
        }
    });

    return Object.entries(stats).map(([category, data]) => ({
        category,
        ...data,
        percentage: data.total > 0 ? (data.correct / data.total) * 100 : 0,
    })).sort((a, b) => a.category.localeCompare(b.category));

  }, [questions, userAnswers]);


  useEffect(() => {
    const incorrectIds = getIncorrectQuestionIds();

    if (isReviewMode) {
      // In modalità ripasso, rimuoviamo le domande a cui si è risposto correttamente
      const correctlyAnsweredIds = new Set(
        questions
          .filter(q => {
            const userAnswer = userAnswers.find(a => a.questionId === q.id);
            return userAnswer?.answerIndex === q.correctAnswer;
          })
          .map(q => q.id)
      );

      const newIncorrectIds = incorrectIds.filter(id => !correctlyAnsweredIds.has(id));
      saveIncorrectQuestionIds(newIncorrectIds);

    } else {
      // In modalità normale, aggiungiamo le nuove domande sbagliate
      const newIncorrectAnswerIds = questions
        .filter(q => {
          const userAnswer = userAnswers.find(a => a.questionId === q.id);
          // Aggiungi solo se c'è una risposta ed è sbagliata
          return userAnswer?.answerIndex !== null && userAnswer?.answerIndex !== q.correctAnswer;
        })
        .map(q => q.id);
      
      if (newIncorrectAnswerIds.length > 0) {
        const combinedIds = [...new Set([...incorrectIds, ...newIncorrectAnswerIds])];
        saveIncorrectQuestionIds(combinedIds);
      }
    }
  }, [questions, userAnswers, isReviewMode]);
  
  const handleGenerateExplanation = async (question: Question) => {
    if (explanations[question.id] || loadingExplanations[question.id]) {
        return; // Don't fetch if already exists or is loading
    }

    setLoadingExplanations(prev => ({ ...prev, [question.id]: true }));
    try {
        const explanation = await generateExplanation(question);
        setExplanations(prev => ({ ...prev, [question.id]: explanation }));
    } catch (error) {
        setExplanations(prev => ({ ...prev, [question.id]: 'Si è verificato un errore durante la generazione della spiegazione.' }));
    } finally {
        setLoadingExplanations(prev => ({ ...prev, [question.id]: false }));
    }
  };

  const headerTitle = isReviewMode ? 'Riepilogo Ripasso' : (isPracticeMode ? 'Riepilogo Pratica' : 'Risultato Esame');
  const headerIconColor = (isPracticeMode || isReviewMode)
    ? 'text-amber-500 dark:text-amber-400' 
    : isPassed 
      ? 'text-green-500 dark:text-green-400' 
      : 'text-red-500 dark:text-red-400';

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div id={PDF_ELEMENT_ID} className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <header className="p-6 text-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <RadioWaveIcon className={`w-16 h-16 mx-auto mb-4 ${headerIconColor}`} />
            <h1 className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
              {headerTitle}
            </h1>
            
            {!(isPracticeMode || isReviewMode) ? (
              <p className={`text-5xl font-bold my-4 ${isPassed ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                {isPassed ? 'SUPERATO' : 'NON SUPERATO'}
              </p>
            ) : (
                 <p className="text-2xl font-bold my-4 text-amber-600 dark:text-amber-400">{title.replace('Pratica: ', '').replace('Ripasso: ', '')}</p>
            )}

            <div className="flex justify-center gap-8 text-lg">
              <div className="text-green-600 dark:text-green-400">
                <span className="font-bold">{correctAnswers}</span> Risposte Corrette
              </div>
              <div className="text-red-600 dark:text-red-400">
                <span className="font-bold">{incorrectAnswers}</span> Risposte Errate
              </div>
            </div>
             {!(isPracticeMode || isReviewMode) && <p className="text-slate-500 dark:text-slate-400 text-sm mt-4">Soglia superamento: {PASSING_SCORE_PERCENTAGE}%</p>}
          </header>

          <main className="p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-300 font-mono mb-4">Statistiche per Argomento</h2>
              <div className="space-y-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  {categoryStats.map(stat => (
                      <div key={stat.category}>
                          <div className="flex justify-between items-center mb-1 text-sm sm:text-base">
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{stat.category}</p>
                              <p className="font-mono text-slate-600 dark:text-slate-300">{stat.correct} / {stat.total} ({Math.round(stat.percentage)}%)</p>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                              <div
                                  className={`${stat.percentage >= PASSING_SCORE_PERCENTAGE ? 'bg-green-500' : 'bg-sky-500'} h-2.5 rounded-full transition-colors duration-300`}
                                  style={{ width: `${stat.percentage}%` }}
                              ></div>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-amber-600 dark:text-amber-300 font-mono mb-4">Riepilogo Domande</h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.answerIndex === question.correctAnswer;
                const unanswered = userAnswer?.answerIndex === null;
                const explanationText = explanations[question.id];
                const isLoadingExplanation = loadingExplanations[question.id];

                return (
                  <div key={question.id} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-600">
                    <div className="flex items-start gap-3">
                        {isCorrect ? <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /> : <XIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />}
                        <p className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-3">
                        <span className="font-mono text-amber-600 dark:text-amber-400 mr-2">{index + 1}.</span> {question.text}
                        </p>
                    </div>
                    
                    <div className="space-y-2 ml-9">
                      {unanswered && (
                          <div className="p-3 rounded border border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-300 mb-2">
                              Non hai risposto a questa domanda.
                          </div>
                      )}
                      {question.options.map((option, optIndex) => {
                        const isUserChoice = userAnswer?.answerIndex === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;
                        
                        let optionClass = 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300';
                        let label = null;

                        if (isCorrectAnswer) {
                            optionClass = 'border-green-500 bg-green-50 text-green-800 dark:border-green-500 dark:bg-green-500/20 dark:text-white';
                            label = <span className="ml-auto text-xs font-bold text-green-600 dark:text-green-300">[ RISPOSTA CORRETTA ]</span>;
                        }
                        if (isUserChoice && !isCorrect) {
                            optionClass = 'border-red-500 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-500/20 dark:text-white';
                            label = <span className="ml-auto text-xs font-bold text-red-600 dark:text-red-300">[ TUA RISPOSTA ]</span>;
                        }

                        return (
                          <div key={optIndex} className={`p-3 rounded border ${optionClass} flex items-center`}>
                            <span className="font-mono mr-3">{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{option}</span>
                            {label}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-600 ml-9">
                      <p className="font-semibold text-sky-600 dark:text-sky-300 text-sm mb-1">Spiegazione:</p>
                        {explanationText ? (
                            <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                                {explanationText}
                            </p>
                        ) : isLoadingExplanation ? (
                            <p className="italic text-slate-500 dark:text-slate-400 animate-pulse">Generazione spiegazione...</p>
                        ) : (
                            <button
                                onClick={() => handleGenerateExplanation(question)}
                                className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors text-sm"
                            >
                                Mostra Spiegazione
                            </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <button
            onClick={onRestart}
            className="bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};