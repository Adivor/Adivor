
import React, { useMemo } from 'react';
import { Question, UserAnswer } from '../types';
import { PASSING_SCORE_PERCENTAGE } from '../constants';
import { generatePdf } from '../services/pdfService';
import { RadioWaveIcon } from './icons/RadioWaveIcon';

interface ResultsScreenProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

const PDF_ELEMENT_ID = 'pdf-results';

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, onRestart }) => {

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

  const handleDownloadPdf = async () => {
    const timestamp = new Date().toISOString().split('T')[0];
    await generatePdf(PDF_ELEMENT_ID, `Esito_Esame_Radioamatore_${timestamp}.pdf`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div id={PDF_ELEMENT_ID} className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
          <header className="p-6 text-center bg-slate-900/50 border-b border-slate-700">
            <RadioWaveIcon className={`w-16 h-16 mx-auto mb-4 ${isPassed ? 'text-green-400' : 'text-red-400'}`} />
            <h1 className="text-3xl font-bold font-mono text-slate-100">Risultato Esame</h1>
            <p className={`text-5xl font-bold my-4 ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {isPassed ? 'SUPERATO' : 'NON SUPERATO'}
            </p>
            <div className="flex justify-center gap-8 text-lg">
              <div className="text-green-400">
                <span className="font-bold">{correctAnswers}</span> Risposte Corrette
              </div>
              <div className="text-red-400">
                <span className="font-bold">{incorrectAnswers}</span> Risposte Errate
              </div>
            </div>
             <p className="text-slate-400 text-sm mt-4">Soglia superamento: {PASSING_SCORE_PERCENTAGE}%</p>
          </header>

          <main className="p-6">
            <h2 className="text-2xl font-bold text-amber-300 font-mono mb-4">Riepilogo Domande</h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.find(a => a.questionId === question.id);
                const isCorrect = userAnswer?.answerIndex === question.correctAnswer;

                return (
                  <div key={question.id} className="p-4 bg-slate-700/40 rounded-lg border border-slate-600">
                    <p className="font-semibold text-lg text-slate-200 mb-3">
                      <span className="font-mono text-amber-400 mr-2">{index + 1}.</span> {question.text}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserChoice = userAnswer?.answerIndex === optIndex;
                        const isCorrectAnswer = question.correctAnswer === optIndex;
                        
                        let optionClass = 'border-slate-500 bg-slate-600/50';
                        if (isCorrectAnswer) {
                            optionClass = 'border-green-500 bg-green-500/20 text-white';
                        }
                        if (isUserChoice && !isCorrect) {
                            optionClass = 'border-red-500 bg-red-500/20 text-white';
                        }

                        return (
                          <div key={optIndex} className={`p-3 rounded border ${optionClass} flex items-center`}>
                            <span className="font-mono mr-3">{String.fromCharCode(65 + optIndex)}.</span>
                            <span>{option}</span>
                            {isUserChoice && !isCorrect && <span className="ml-auto text-xs font-bold text-red-300">[ TUA RISPOSTA ]</span>}
                            {isCorrectAnswer && <span className={`ml-auto text-xs font-bold ${!isUserChoice ? 'text-green-300' : ''} ${isUserChoice && 'hidden pdf-unhide'}`}>[ RISPOSTA CORRETTA ]</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onRestart}
            className="w-full sm:w-auto bg-slate-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-500 transition-colors"
          >
            Nuova Simulazione
          </button>
          <button
            onClick={handleDownloadPdf}
            className="w-full sm:w-auto bg-amber-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-amber-400 transition-colors"
          >
            Scarica Riepilogo (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
