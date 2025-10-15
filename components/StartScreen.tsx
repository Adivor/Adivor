import React, { useState } from 'react';
import { RadioWaveIcon } from './icons/RadioWaveIcon';
import { QuestionCategory } from '../types';
import { getQuestionCountByCategory } from '../services/questionService';
import { PayPalIcon } from './icons/PayPalIcon';

interface StartScreenProps {
  onStartSimulation: (isStudyMode: boolean) => void;
  onStartTopicQuiz: (category: QuestionCategory, isStudyMode: boolean, count: number | 'all') => void;
  onViewQuestions: (category: QuestionCategory) => void;
}

interface QuestionCountModalProps {
  category: QuestionCategory;
  onClose: () => void;
  onStart: (count: number | 'all') => void;
}

const QuestionCountModal: React.FC<QuestionCountModalProps> = ({ category, onClose, onStart }) => {
    const totalQuestions = getQuestionCountByCategory(category);
    
    const options: (number)[] = [];
    if (totalQuestions >= 10) options.push(10);
    if (totalQuestions >= 30) options.push(30);

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-[fadeIn_0.3s_ease-out]"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-2xl p-6 md:p-8 border border-slate-700 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-amber-300 mb-2 font-mono">Pratica per Argomento</h2>
                <p className="text-slate-300 mb-6">Quante domande vuoi per <br/> <span className="font-bold text-amber-400">{category}</span>?</p>
                
                <div className="space-y-3">
                    {options.map(opt => (
                        <button 
                            key={opt}
                            onClick={() => onStart(opt)}
                            className="w-full bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200 text-center"
                        >
                            {opt} Domande
                        </button>
                    ))}
                    <button 
                        onClick={() => onStart('all')}
                        className="w-full bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200 text-center"
                    >
                        Tutte le domande ({totalQuestions})
                    </button>
                </div>

                <button 
                    onClick={onClose} 
                    className="mt-6 w-full bg-slate-600/50 text-slate-300 font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                >
                    Annulla
                </button>
            </div>
        </div>
    );
};


export const StartScreen: React.FC<StartScreenProps> = ({ onStartSimulation, onStartTopicQuiz, onViewQuestions }) => {
  const categories = Object.values(QuestionCategory);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [modalState, setModalState] = useState<{ isOpen: boolean; category: QuestionCategory | null }>({
    isOpen: false,
    category: null,
  });

  const handleOpenModal = (category: QuestionCategory) => {
    setModalState({ isOpen: true, category });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, category: null });
  };

  const handleStartPractice = (count: number | 'all') => {
    if (modalState.category) {
      onStartTopicQuiz(modalState.category, isStudyMode, count);
    }
    handleCloseModal();
  };


  return (
    <>
      {modalState.isOpen && modalState.category && (
        <QuestionCountModal 
          category={modalState.category}
          onClose={handleCloseModal}
          onStart={handleStartPractice}
        />
      )}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-3xl w-full bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4 font-mono mt-6">
              Simulatore Esame Radioamatore
            </h1>
            <p className="text-slate-300 text-lg mb-8">
              Metti alla prova la tua preparazione con una simulazione completa dell'esame o esercitati sui singoli argomenti.
            </p>
            <button
              onClick={() => onStartSimulation(isStudyMode)}
              className="bg-amber-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
            >
              Inizia Il Tuo Esame
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center bg-slate-900/50 p-4 rounded-lg">
              <input 
                  type="checkbox" 
                  id="study-mode" 
                  checked={isStudyMode} 
                  onChange={(e) => setIsStudyMode(e.target.checked)}
                  className="w-5 h-5 rounded text-amber-500 bg-slate-700 border-slate-500 focus:ring-amber-500 focus:ring-offset-slate-800"
              />
              <label htmlFor="study-mode" className="ml-3 text-slate-200 font-medium">
                  Modalità Studio <span className="text-xs text-slate-400">(mostra risposte e spiegazioni)</span>
              </label>
          </div>


          <div className="mt-12 pt-8 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-center text-amber-300 mb-6 font-mono">Pratica per Argomento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleOpenModal(category)}
                  className="w-full bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200 text-left flex items-center"
                >
                  <RadioWaveIcon className="w-5 h-5 mr-3 text-amber-500/80" />
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-center text-amber-300 mb-6 font-mono">Elenco Domande Esame con Risposte Corrette</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => (
                <button
                  key={`${category}-view`}
                  onClick={() => onViewQuestions(category)}
                  className="w-full bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors duration-200 text-left flex items-center"
                >
                  <RadioWaveIcon className="w-5 h-5 mr-3 text-amber-500/80" />
                  {category}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-500 mt-12 text-center">
            In bocca al lupo! 73
          </p>

          <div className="text-center mt-5">
            <form action="https://www.paypal.com/donate" method="post" target="_blank" className="inline-block">
              <input type="hidden" name="business" value="hamquizcontatti@gmail.com" />
              <input type="hidden" name="no_recurring" value="0" />
              <input type="hidden" name="currency_code" value="EUR" />
              <button 
                type="submit" 
                className="bg-[#0070ba] hover:bg-[#005c99] text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
              >
                <PayPalIcon className="w-6 h-6 mr-3" />
                <span>Fai una donazione con PayPal</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};