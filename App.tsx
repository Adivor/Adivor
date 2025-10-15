import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { QuestionsViewScreen } from './components/QuestionsViewScreen';
import { Footer } from './components/Footer';
import { QuizState, Question, UserAnswer, QuestionCategory } from './types';
import { getQuizQuestions, getQuestionsByCategory, getQuestionsByIds } from './services/questionService';
import { getIncorrectQuestionIds } from './services/storageService';
import { generateExplanation } from './services/aiService';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [viewCategory, setViewCategory] = useState<QuestionCategory | null>(null);
  const [explanations, setExplanations] = useState<Record<number, string>>({});

  const handleStartSimulation = (studyMode: boolean) => {
    setQuestions(getQuizQuestions());
    setQuizTitle('Simulazione Esame Completo');
    setIsStudyMode(studyMode);
    setIsPracticeMode(false);
    setIsReviewMode(false);
    setQuizState('active');
  };

  const handleStartTopicQuiz = (category: QuestionCategory, studyMode: boolean, count: number | 'all') => {
    setQuestions(getQuestionsByCategory(category, count));
    setQuizTitle(`Pratica: ${category}`);
    setIsStudyMode(studyMode);
    setIsPracticeMode(true);
    setIsReviewMode(false);
    setQuizState('active');
  };

  const handleStartReview = (studyMode: boolean) => {
    const incorrectIds = getIncorrectQuestionIds();
    if (incorrectIds.length > 0) {
        setQuestions(getQuestionsByIds(incorrectIds));
        setQuizTitle('Ripasso: Domande Errate');
        setIsStudyMode(studyMode);
        setIsPracticeMode(true); // Treat review as a practice mode
        setIsReviewMode(true);
        setQuizState('active');
    }
  };

  const handleViewQuestions = (category: QuestionCategory) => {
    setViewCategory(category);
    setQuizState('view-questions');
    window.scrollTo(0, 0);
  };

  const handleFinish = (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setQuizState('finished');
  };

  const handleRestart = () => {
    setQuizState('start');
    setQuestions([]);
    setUserAnswers([]);
    setQuizTitle('');
    setIsStudyMode(false);
    setIsPracticeMode(false);
    setIsReviewMode(false);
    setViewCategory(null);
    setExplanations({});
    window.scrollTo(0, 0);
  };

  // Effect to fetch explanations sequentially when the quiz is finished
  useEffect(() => {
    const fetchExplanationsSequentially = async () => {
      if (quizState === 'finished' && questions.length > 0) {
        // Set initial loading state for all questions
        const loadingExplanations: Record<number, string> = {};
        questions.forEach(q => {
          loadingExplanations[q.id] = 'Caricamento...';
        });
        setExplanations(loadingExplanations);

        // Fetch explanations one by one to avoid rate limiting
        for (const question of questions) {
          try {
            const explanation = await generateExplanation(question);
            setExplanations(prev => ({ ...prev, [question.id]: explanation }));
          } catch (error) {
            console.error(`Failed to generate explanation for question ${question.id}`, error);
            setExplanations(prev => ({ ...prev, [question.id]: 'Spiegazione non disponibile a causa di un errore di rete.' }));
          }
        }
      }
    };

    fetchExplanationsSequentially();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizState, questions]);


  // Effect to manage dynamic page title
  useEffect(() => {
    switch (quizState) {
      case 'active':
        document.title = `Quiz in corso... - ${quizTitle}`;
        break;
      case 'finished':
        document.title = `Risultati - ${quizTitle}`;
        break;
      case 'view-questions':
        if (viewCategory) {
          document.title = `Elenco Domande: ${viewCategory}`;
        }
        break;
      case 'start':
      default:
        document.title = 'Simulatore Esame Radioamatore';
    }
  }, [quizState, quizTitle, viewCategory]);

  // Effect to prevent content copying
  useEffect(() => {
    const preventCopy = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', preventCopy);
    document.addEventListener('copy', preventCopy);

    return () => {
      document.removeEventListener('contextmenu', preventCopy);
      document.removeEventListener('copy', preventCopy);
    };
  }, []); // Empty dependency array to run only once


  const renderContent = () => {
    switch (quizState) {
      case 'active':
        return (
          <QuizScreen
            questions={questions}
            onFinish={handleFinish}
            onRestart={handleRestart}
            title={quizTitle}
            isStudyMode={isStudyMode}
            isPracticeMode={isPracticeMode}
          />
        );
      case 'finished':
        return (
          <ResultsScreen
            questions={questions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
            title={quizTitle}
            isPracticeMode={isPracticeMode}
            isStudyMode={isStudyMode}
            isReviewMode={isReviewMode}
            explanations={explanations}
          />
        );
      case 'view-questions':
        if (viewCategory) {
          return <QuestionsViewScreen category={viewCategory} onBack={handleRestart} />;
        }
        // Fallback to start screen if category is not set
        return <StartScreen 
          onStartSimulation={handleStartSimulation} 
          onStartTopicQuiz={handleStartTopicQuiz}
          onViewQuestions={handleViewQuestions}
          onStartReview={handleStartReview}
        />;
      case 'start':
      default:
        return (
          <StartScreen 
            onStartSimulation={handleStartSimulation} 
            onStartTopicQuiz={handleStartTopicQuiz}
            onViewQuestions={handleViewQuestions}
            onStartReview={handleStartReview}
          />
        );
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;