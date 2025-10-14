import React, { useState, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { getQuizQuestions, getQuestionsByCategory } from './services/questionService';
import { Question, UserAnswer, QuizState, QuestionCategory } from './types';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);

  const startQuiz = (getQuestions: () => Question[]) => {
    setIsLoading(true);
    // Simulate loading to improve UX
    setTimeout(() => {
      const newQuestions = getQuestions();
      setQuestions(newQuestions);
      setQuizState('active');
      setIsLoading(false);
    }, 500);
  };

  const handleStartSimulation = useCallback((studyMode: boolean) => {
    setQuizTitle("Simulazione d'Esame");
    setIsPracticeMode(false);
    setIsStudyMode(studyMode);
    startQuiz(getQuizQuestions);
  }, []);

  const handleStartTopicQuiz = useCallback((category: QuestionCategory, studyMode: boolean, count: number | 'all') => {
    setQuizTitle(`Pratica: ${category}`);
    setIsPracticeMode(true);
    setIsStudyMode(studyMode);
    startQuiz(() => getQuestionsByCategory(category, count));
  }, []);

  const handleFinish = (finalAnswers: UserAnswer[]) => {
    setUserAnswers(finalAnswers);
    setQuizState('finished');
  };
  
  const handleRestart = () => {
      setQuestions([]);
      setUserAnswers([]);
      setQuizTitle('');
      setIsPracticeMode(false);
      setIsStudyMode(false);
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
        return <StartScreen onStartSimulation={handleStartSimulation} onStartTopicQuiz={handleStartTopicQuiz} />;
      case 'active':
        return <QuizScreen 
                    questions={questions} 
                    onFinish={handleFinish} 
                    onRestart={handleRestart} 
                    title={quizTitle} 
                    isStudyMode={isStudyMode} 
                    isPracticeMode={isPracticeMode}
                />;
      case 'finished':
        return <ResultsScreen 
                    questions={questions} 
                    userAnswers={userAnswers} 
                    onRestart={handleRestart} 
                    title={quizTitle} 
                    isPracticeMode={isPracticeMode}
                    isStudyMode={isStudyMode}
                />;
      default:
        return <StartScreen onStartSimulation={handleStartSimulation} onStartTopicQuiz={handleStartTopicQuiz} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

export default App;