import React, { useState, useEffect, useCallback } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { getQuizQuestions, getQuestionsByCategory } from './services/questionService';
import { Question, UserAnswer, QuizState, QuestionCategory, ExplanationState } from './types';
import { GoogleGenAI } from '@google/genai';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('start');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [isStudyMode, setIsStudyMode] = useState<boolean>(false);
  const [explanations, setExplanations] = useState<Record<number, ExplanationState>>({});

  const fetchExplanationForQuestion = useCallback(async (question: Question) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setExplanations(prev => ({
        ...prev,
        [question.id]: { text: 'API Key non configurata.', isLoading: false, error: true }
      }));
      return;
    }

    // Set loading state to prevent re-fetching
    setExplanations(prev => ({
      ...prev,
      [question.id]: { text: '', isLoading: true, error: false }
    }));

    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = "Sei un esperto istruttore per esami da radioamatore. Fornisci una spiegazione chiara e concisa per la domanda fornita. Spiega perché la risposta corretta è tale e, se rilevante, perché le altre sono sbagliate. Rispondi in italiano in non più di 3-4 frasi.";
      
      const prompt = `Domanda: ${question.text}
Opzioni:
${question.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n')}
Risposta Corretta: ${String.fromCharCode(65 + question.correctAnswer)}) ${question.options[question.correctAnswer]}

Spiegazione:`;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ parts: [{ text: prompt }] }],
          config: {
            systemInstruction,
          }
      });
      
      setExplanations(prev => ({
          ...prev,
          [question.id]: { text: response.text, isLoading: false, error: false }
      }));
    } catch (err) {
      console.error(`Error fetching explanation for question ${question.id}:`, err);
      setExplanations(prev => ({
          ...prev,
          [question.id]: { text: 'Impossibile generare la spiegazione per questa domanda.', isLoading: false, error: true }
      }));
    }
  }, []);


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
      setExplanations({}); // Reset explanations
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
                    fetchExplanationForQuestion={fetchExplanationForQuestion}
                    explanations={explanations}
                />;
      case 'finished':
        return <ResultsScreen 
                    questions={questions} 
                    userAnswers={userAnswers} 
                    onRestart={handleRestart} 
                    title={quizTitle} 
                    isPracticeMode={isPracticeMode}
                    explanations={explanations}
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