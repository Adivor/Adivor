
import React from 'react';
import { RadioWaveIcon } from './icons/RadioWaveIcon';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="max-w-2xl w-full bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
        <RadioWaveIcon className="w-24 h-24 text-amber-400 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-amber-300 mb-4 font-mono">
          Simulatore Esame Radioamatore
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          Metti alla prova la tua preparazione con una simulazione completa dell'esame.
          Rispondi a 50 domande a risposta multipla estratte casualmente dagli argomenti ufficiali.
        </p>
        <button
          onClick={onStart}
          className="bg-amber-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-xl hover:bg-amber-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          Inizia la Simulazione
        </button>
        <p className="text-sm text-slate-500 mt-8">
          In bocca al lupo! 73
        </p>
      </div>
    </div>
  );
};
