import React, { useState } from 'react';
import { Question, UserAnswer } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (answers: UserAnswer[]) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(() => 
    questions.map(q => ({ questionId: q.id, answerIndex: null }))
  );
  const [isAdvancing, setIsAdvancing] = useState(false);

  const answeredCount = userAnswers.filter(a => a.answerIndex !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (isAdvancing) return;

    setIsAdvancing(true);
    const newAnswers = userAnswers.map(a =>
      a.questionId === questionId ? { ...a, answerIndex } : a
    );
    setUserAnswers(newAnswers);

    setTimeout(() => {
      const isLastQuestion = currentQuestionIndex === questions.length - 1;

      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAdvancing(false);
      } else {
        const allAnswered = newAnswers.every(a => a.answerIndex !== null);
        if (allAnswered) {
          onFinish(newAnswers);
        } else {
          setIsAdvancing(false);
        }
      }
    }, 500);
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
  
  const handleFinish = () => {
    if(window.confirm("Sei sicuro di voler terminare l'esame?")) {
        onFinish(userAnswers);
    }
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-4xl w-full bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
        <header className="p-4 bg-slate-900/50 border-b border-slate-700">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-amber-300 font-mono">Simulazione d'Esame</h2>
            <div className="text-lg font-mono text-slate-300">
              Domanda <span className="text-amber-400">{currentQuestionIndex + 1}</span> / {questions.length}
            </div>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </header>

        <main className="p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm text-amber-400 font-mono mb-2">{currentQuestion.category}</p>
            <h3 className="text-2xl font-semibold text-slate-100">{currentQuestion.text}</h3>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer?.answerIndex === index;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  disabled={isAdvancing}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-slate-500 text-slate-300'
                  } ${isAdvancing ? 'cursor-wait' : ''}`}
                >
                  <span className={`font-mono mr-3 font-bold ${isSelected ? 'text-amber-400' : 'text-slate-400'}`}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </button>
              );
            })}
          </div>
        </main>
        
        <footer className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center">
            <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0 || isAdvancing}
                className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500"
            >
                Precedente
            </button>

            {answeredCount === questions.length ? (
                 <button
                    onClick={handleFinish}
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-500 transition-colors animate-pulse"
                >
                    Termina e Valuta
                </button>
            ) : (
                <div className="text-sm text-slate-400">{answeredCount} / {questions.length} risposte</div>
            )}

            <button
                onClick={goToNext}
                disabled={currentQuestionIndex === questions.length - 1 || isAdvancing}
                className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors disabled:bg-slate-700 disabled:cursor-not-allowed disabled:text-slate-500"
            >
                Successivo
            </button>
        </footer>
      </div>
    </div>
  );
};