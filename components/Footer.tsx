import React from 'react';
import { ThemeToggle } from './ThemeToggle';

interface FooterProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Footer: React.FC<FooterProps> = ({ theme, onToggleTheme }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-6 text-center text-sm text-slate-500 dark:text-slate-400">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
        <p>&copy; {currentYear}. Tutti i diritti riservati.</p>
        <p className="mt-2">
          Mail per contatti: <a href="mailto:hamquizcontatti@gmail.com" className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 underline">HamQuiz</a>
        </p>
        <p className="mt-2">Non raccogliamo nessuna informazione personale.</p>
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Le domande d'esame sono soggette a modifiche da parte delle autorità competenti senza preavviso. Non siamo responsabili per eventuali discrepanze.
        </p>
      </div>
    </footer>
  );
};