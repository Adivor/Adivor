import React, { useMemo, useState } from 'react';
import { Question, UserAnswer } from '../types';
import { PASSING_SCORE_PERCENTAGE } from '../constants';
import { RadioWaveIcon } from './icons/RadioWaveIcon';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { GoogleGenAI } from '@google/genai';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
  title: string;
  isPracticeMode: boolean;
  isStudyMode: boolean;
}

const PDF_ELEMENT_ID = 'pdf-results';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart, title, isPracticeMode }) => {
  const [aiExplanations, setAiExplanations] = useState<Record<number, string | null>>({});
  const [loadingExplanationId, setLoadingExplanationId] = useState<number | null>(null);

  const { score, correctAnswers, incorrectAnswers, isPassed } = useMemo(() => {
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

  const handleGenerateExplanation = async (question: Question) => {
    if (loadingExplanationId !== null) return;
    
    setLoadingExplanationId(question.id);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const optionsString = question.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join('\n');
      const correctOption = `${String.fromCharCode(65 + question.correctAnswer)}) ${question.options[question.correctAnswer]}`;

      const prompt = `Sei un esperto istruttore per l'esame da radioamatore. Spiega in modo chiaro, conciso e in italiano perché la risposta corretta alla seguente domanda è '${correctOption}'.
Domanda: "${question.text}"
Opzioni:
${optionsString}

Fornisci una spiegazione didattica, concentrandoti sul concetto tecnico o normativo alla base della risposta corretta. Se opportuno, spiega brevemente perché le altre opzioni sono errate.`;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt
      });

      setAiExplanations(prev => ({ ...prev, [question.id]: response.text }));

    } catch (error) {
      console.error("Errore durante la generazione della spiegazione:", error);
      setAiExplanations(prev => ({ ...prev, [question.id]: "Si è verificato un errore durante la generazione della spiegazione. Riprova." }));
    } finally {
      setLoadingExplanationId(null);
    }
  };

  const headerIconColor = isPracticeMode 
    ? 'text-amber-400' 
    : isPassed 
      ? 'text-green-400' 
      : 'text-red-400';

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div id={PDF_ELEMENT_ID} className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
          <header className="p-6 text-center bg-slate-900/50 border-b border-slate-700">
            <RadioWaveIcon className={`w-16 h-16 mx-auto mb-4 ${headerIconColor}`} />
            <h1 className="text-3xl font-bold font-mono text-slate-100">
              {isPracticeMode ? 'Riepilogo Pratica' : 'Risultato Esame'}
            </h1>
            
            {isPracticeMode ? (
              <p className="text-2xl font-bold my-4 text-amber-400">{title.replace('Pratica: ', '')}</p>
            ) : (
              <p className={`text-5xl font-bold my-4 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                {isPassed ? 'SUPERATO' : 'NON SUPERATO'}
              </p>
            )}

            <div className="flex justify-center gap-8 text-lg">
              <div className="text-green-400">
                <span className="font-bold">{correctAnswers}</span> Risposte Corrette
              </div>
              <div className="text-red-400">
                <span className="font-bold">{incorrectAnswers}</span> Risposte Errate
              </div>
            </div>
             {!isPracticeMode && <p className="text-slate-400 text-sm mt-4">Soglia superamento: {PASSING_SCORE_PERCENTAGE}%</p>}
          </header>

          <main className="p-6">
            <h2 className="text-2xl font-bold text-amber-300 font-mono mb-4">Riepilogo Domande</h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.answerIndex === question.correctAnswer;
                const unanswered = userAnswer?.answerIndex === null;

                return (
                  <div key={question.id} className="p-4 bg-slate-700/40 rounded-lg border border-slate-600">
                    <div className="flex items-start gap-3">
                        {isCorrect ? <CheckIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" /> : <XIcon className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />}
                        <p className="font-semibold text-lg text-slate-200 mb-3">
                        <span className="font-mono text-amber-400 mr-2">{index + 1}.</span> {question.text}
                        </p>
                    </div>
                    
                    <div className="space-y-2 ml-9">
                      {unanswered && (
                          <div className="p-3 rounded border border-yellow-500 bg-yellow-500/20 text-yellow-300 mb-2">
                              Non hai risposto a questa domanda.
                          </div>
                      )}
                      {question.options.map((option, optIndex) => {
                        const isUserChoice = userAnswer?.answerIndex === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;
                        
                        let optionClass = 'border-slate-600 bg-slate-800/50 text-slate-300';
                        let label = null;

                        if (isCorrectAnswer) {
                            optionClass = 'border-green-500 bg-green-500/20 text-white';
                            label = <span className="ml-auto text-xs font-bold text-green-300">[ RISPOSTA CORRETTA ]</span>;
                        }
                        if (isUserChoice && !isCorrect) {
                            optionClass = 'border-red-500 bg-red-500/20 text-white';
                            label = <span className="ml-auto text-xs font-bold text-red-300">[ TUA RISPOSTA ]</span>;
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
                    
                    {!aiExplanations[question.id] && (
                      <div className="mt-4 ml-9">
                        <button
                          onClick={() => handleGenerateExplanation(question)}
                          disabled={loadingExplanationId !== null}
                          className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors disabled:bg-slate-600 disabled:cursor-wait text-sm"
                          aria-label={`Genera spiegazione per la domanda ${index + 1}`}
                          aria-live="polite"
                        >
                          {loadingExplanationId === question.id ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generazione...
                            </span>
                          ) : 'Spiegazione AI'}
                        </button>
                      </div>
                    )}
                    {aiExplanations[question.id] && (
                      <div className="mt-4 p-3 bg-slate-900/50 rounded-md border border-slate-600 ml-9">
                          <p className="font-semibold text-sky-300 text-sm mb-1">Spiegazione AI:</p>
                          <p className="text-slate-300 text-sm whitespace-pre-wrap">{aiExplanations[question.id]}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </main>
        </div>
        <div className="mt-8 flex justify-center items-center">
          <button
            onClick={onRestart}
            className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-500 transition-colors"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    </div>
  );
};