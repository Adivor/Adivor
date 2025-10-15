import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Question, UserAnswer } from '../types';
import { QUIZ_DURATION_MINUTES } from '../constants';
import { ClockIcon } from './icons/ClockIcon';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (answers: UserAnswer[]) => void;
  onRestart: () => void;
  title: string;
  isStudyMode: boolean;
  isPracticeMode: boolean;
}

type Feedback = {
    isCorrect: boolean;
    selectedIndex: number;
} | null;

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish, onRestart, title, isStudyMode, isPracticeMode }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(() => 
    questions.map(q => ({ questionId: q.id, answerIndex: null }))
  );
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_MINUTES * 60);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  
  const timeoutRef = useRef<number | null>(null);

  // Calculate stats for each category based on answered questions
  const categoryStats = useMemo(() => {
    const stats: Record<string, { correct: number, answered: number }> = {};
    // FIX: Add explicit types to the Map constructor to resolve type inference issues.
    const questionMap = new Map<number, Question>(questions.map(q => [q.id, q]));

    for (const userAnswer of userAnswers) {
      if (userAnswer.answerIndex !== null) {
        const question = questionMap.get(userAnswer.questionId);
        if (question) {
          const category = question.category;
          if (!stats[category]) {
            stats[category] = { correct: 0, answered: 0 };
          }
          stats[category].answered++;
          if (userAnswer.answerIndex === question.correctAnswer) {
            stats[category].correct++;
          }
        }
      }
    }
    return stats;
  }, [userAnswers, questions]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isPracticeMode) return;

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isPracticeMode]);

  // Auto-finish effect when time runs out
  useEffect(() => {
    if (!isPracticeMode && timeLeft === 0) {
      alert("Tempo scaduto! L'esame verrà terminato e valutato.");
      onFinish(userAnswers);
    }
  }, [timeLeft, isPracticeMode, onFinish, userAnswers]);

  const answeredCount = userAnswers.filter(a => a.answerIndex !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);

  const handleAnswerSelect = (questionId: number, selectedIndex: number) => {
    if (feedback) return; // Don't allow changes while feedback is shown

    const newAnswers = userAnswers.map(a =>
      a.questionId === questionId ? { ...a, answerIndex: selectedIndex } : a
    );
    setUserAnswers(newAnswers);

    if (isStudyMode) {
      const isCorrect = selectedIndex === currentQuestion.correctAnswer;
      setFeedback({ isCorrect, selectedIndex });
      
      timeoutRef.current = window.setTimeout(() => {
        setFeedback(null);
        goToNext();
      }, isCorrect ? 1500 : 2500);
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
     if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleFinishAndGrade = () => {
    if (isFinishing) return;

    const unansweredCount = userAnswers.filter(a => a.answerIndex === null).length;

    const proceedToFinish = () => {
        setIsFinishing(true);
        onFinish(userAnswers);
    };

    if (unansweredCount > 0) {
        // There are unanswered questions, ask for confirmation.
        const confirmationMessage = `Ci sono ${unansweredCount} domande senza risposta. Sei sicuro di voler terminare? Le domande senza risposta verranno contate come errate.`;
        if (window.confirm(confirmationMessage)) {
            // User confirmed
            proceedToFinish();
        }
        // If user clicks "Cancel", the function simply ends here.
    } else {
        // All questions are answered, finish directly.
        proceedToFinish();
    }
  };


  const handleReturnHome = () => {
    onRestart();
  }
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  const isTimeLow = !isPracticeMode && timeLeft <= 5 * 60;

  const currentCategoryStats = categoryStats[currentQuestion.category];

  return (
    <div className="flex flex-col flex-grow items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <header className="p-4 bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center gap-4 mb-2">
            <button 
              onClick={handleReturnHome} 
              className="bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
            >
                Abbandona
            </button>
            
            <h2 className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-300 font-mono text-center truncate hidden md:block">{title}</h2>
            
            <div className="flex items-center justify-end gap-2 sm:gap-4 flex-shrink-0">
              {!isPracticeMode && (
                 <div className={`flex items-center gap-1 sm:gap-2 text-base sm:text-lg font-mono font-bold ${isTimeLow ? 'text-red-500 animate-pulse' : 'text-slate-600 dark:text-slate-300'}`}>
                   <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                   <span>{formatTime(timeLeft)}</span>
                 </div>
              )}
              <div className="text-base sm:text-lg font-mono text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700/50 px-3 py-1 rounded-md flex items-center">
                {isStudyMode && currentCategoryStats && currentCategoryStats.answered > 0 && (
                  <span 
                    className="text-sky-500 dark:text-sky-400 mr-3 text-sm font-bold" 
                    title={`Andamento per ${currentQuestion.category}: ${currentCategoryStats.correct}/${currentCategoryStats.answered}`}
                  >
                    {Math.round((currentCategoryStats.correct / currentCategoryStats.answered) * 100)}%
                  </span>
                )}
                <span className="text-amber-600 dark:text-amber-400">{currentQuestionIndex + 1}</span>/{questions.length}
              </div>
            </div>
          </div>
          <h2 className="md:hidden text-lg font-bold text-amber-600 dark:text-amber-300 font-mono text-center mb-2 truncate">{title}</h2>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        <main className="p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm text-amber-500 dark:text-amber-400 font-mono mb-2">{currentQuestion.category}</p>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{currentQuestion.text}</h3>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer?.answerIndex === index;
              
              let animationClass = '';
              let optionClass = 'bg-white border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-700 dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-slate-500 dark:text-slate-300';
              
              if (feedback) {
                const isCorrectAnswer = currentQuestion.correctAnswer === index;
                const isSelectedAnswer = feedback.selectedIndex === index;

                if (isCorrectAnswer) {
                    animationClass = 'animate-flash-green';
                    optionClass = 'bg-green-100 border-green-500 text-green-800 dark:bg-green-500/30 dark:border-green-500 dark:text-white';
                } else if (isSelectedAnswer && !feedback.isCorrect) {
                    animationClass = 'animate-shake animate-flash-red';
                    optionClass = 'bg-red-100 border-red-500 text-red-800 dark:bg-red-500/30 dark:border-red-500 dark:text-white';
                } else {
                    optionClass = 'bg-slate-100 border-slate-300 text-slate-500 dark:bg-slate-700/50 dark:border-slate-600 dark:text-slate-400 cursor-default';
                }
              } else if (isSelected) {
                optionClass = 'bg-amber-100 border-amber-500 text-amber-900 dark:bg-amber-500/20 dark:border-amber-500 dark:text-white';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  disabled={!!feedback || (isStudyMode && currentAnswer?.answerIndex !== null)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${optionClass} ${animationClass}`}
                >
                  <span className={`font-mono mr-3 font-bold ${isSelected ? 'text-amber-500 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
          
        </main>
        
        <footer className="p-4 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0 || !!feedback}
                className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
            >
                Precedente
            </button>

             <button
                onClick={handleFinishAndGrade}
                disabled={isFinishing}
                className={`font-bold py-2 px-6 rounded-lg transition-colors text-white ${
                    answeredCount === questions.length 
                    ? 'bg-green-600 hover:bg-green-500 animate-pulse' 
                    : 'bg-amber-600 hover:bg-amber-500'
                } disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-400 dark:disabled:text-slate-500`}
            >
                {isFinishing ? 'Valutazione...' : 'Termina e Valuta'}
            </button>

            <button
                onClick={goToNext}
                disabled={currentQuestionIndex === questions.length - 1 || !!feedback}
                className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition-colors disabled:bg-slate-100 disabled:text-slate-400 dark:bg-slate-600 dark:text-white dark:hover:bg-slate-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
            >
                Successivo
            </button>
        </footer>
      </div>
    </div>
  );
};