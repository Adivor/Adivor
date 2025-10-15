import React, { useState, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { getQuizQuestions, getQuestionsByCategory, getQuestionsByIds } from './services/questionService';
import { getIncorrectQuestionIds } from './services/storageService';
import { Question, UserAnswer, QuizState, QuestionCategory } from './types';
import { QuestionsViewScreen } from './components/QuestionsViewScreen';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [viewCategory, setViewCategory] = useState<QuestionCategory | null>(null);
  const [explanations, setExplanations] = useState<Record<number, string>>({});

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
    setIsReviewMode(false);
    startQuiz(getQuizQuestions);
  }, []);

  const handleStartTopicQuiz = useCallback((category: QuestionCategory, studyMode: boolean, count: number | 'all') => {
    setQuizTitle(`Pratica: ${category}`);
    setIsPracticeMode(true);
    setIsStudyMode(studyMode);
    setIsReviewMode(false);
    startQuiz(() => getQuestionsByCategory(category, count));
  }, []);
  
  const handleStartReview = useCallback((studyMode: boolean) => {
    setQuizTitle("Ripasso: Domande Errate");
    setIsPracticeMode(true); // La modalità ripasso si comporta come una pratica (senza timer/punteggio)
    setIsStudyMode(studyMode);
    setIsReviewMode(true);
    startQuiz(() => {
        const ids = getIncorrectQuestionIds();
        return getQuestionsByIds(ids);
    });
  }, []);

  const handleViewQuestions = useCallback((category: QuestionCategory) => {
    setViewCategory(category);
    setQuizState('view-questions');
  }, []);

  const handleFinish = (finalAnswers: UserAnswer[]) => {
    setUserAnswers(finalAnswers);
    setQuizState('finished');
  };

  const handleExplanationGenerated = useCallback((questionId: number, explanation: string) => {
    setExplanations(prev => ({ ...prev, [questionId]: explanation }));
  }, []);
  
  const handleRestart = () => {
      setQuestions([]);
      setUserAnswers([]);
      setQuizTitle('');
      setIsPracticeMode(false);
      setIsStudyMode(false);
      setIsReviewMode(false);
      setViewCategory(null);
      setExplanations({});
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
        return <StartScreen onStartSimulation={handleStartSimulation} onStartTopicQuiz={handleStartTopicQuiz} onViewQuestions={handleViewQuestions} onStartReview={handleStartReview} />;
      case 'active':
        return <QuizScreen 
                    questions={questions} 
                    onFinish={handleFinish} 
                    onRestart={handleRestart} 
                    title={quizTitle} 
                    isStudyMode={isStudyMode} 
                    isPracticeMode={isPracticeMode}
                    explanations={explanations}
                    onExplanationGenerated={handleExplanationGenerated}
                />;
      case 'finished':
        return <ResultsScreen 
                    questions={questions} 
                    userAnswers={userAnswers} 
                    onRestart={handleRestart} 
                    title={quizTitle} 
                    isPracticeMode={isPracticeMode}
                    isStudyMode={isStudyMode}
                    isReviewMode={isReviewMode}
                    explanations={explanations}
                />;
      case 'view-questions':
        return <QuestionsViewScreen 
            category={viewCategory!} 
            onBack={handleRestart}
        />;
      default:
        return <StartScreen onStartSimulation={handleStartSimulation} onStartTopicQuiz={handleStartTopicQuiz} onViewQuestions={handleViewQuestions} onStartReview={handleStartReview} />;
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

export default App;