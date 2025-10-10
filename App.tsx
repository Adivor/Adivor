
import React, { useState, useEffect, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { getQuizQuestions } from './services/questionService';
import { Question, UserAnswer, QuizState } from './types';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleStart = useCallback(() => {
    setIsLoading(true);
    // Simulate loading to improve UX
    setTimeout(() => {
      const newQuestions = getQuizQuestions();
      setQuestions(newQuestions);
      setQuizState('active');
      setIsLoading(false);
    }, 500);
  }, []);

  const handleFinish = (finalAnswers: UserAnswer[]) => {
    setUserAnswers(finalAnswers);
    setQuizState('finished');
  };
  
  const handleRestart = () => {
      setQuestions([]);
      setUserAnswers([]);
      setQuizState('start');
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-400"></div>
            <p className="ml-4 text-xl text-slate-300">Caricamento domande...</p>
        </div>
      );
    }

    switch (quizState) {
      case 'start':
        return <StartScreen onStart={handleStart} />;
      case 'active':
        return <QuizScreen questions={questions} onFinish={handleFinish} />;
      case 'finished':
        return <ResultsScreen questions={questions} userAnswers={userAnswers} onRestart={handleRestart} />;
      default:
        return <StartScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
