import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center h-8 w-16 rounded-full transition-colors bg-slate-200 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-white dark:focus:ring-offset-slate-800"
      aria-label={`Passa al tema ${theme === 'light' ? 'scuro' : 'chiaro'}`}
    >
      <span className="sr-only">Cambia tema</span>
      <span
        className={`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ${
          theme === 'dark' ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
        }`}
        aria-hidden="true"
      >
        <MoonIcon className="h-5 w-5 text-slate-400" />
      </span>
      <span
        className={`absolute inset-0 h-full w-full flex items-center justify-center transition-opacity ${
          theme === 'light' ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100'
        }`}
        aria-hidden="true"
      >
        <SunIcon className="h-5 w-5 text-amber-500" />
      </span>
      <span
        className={`transform transition-transform duration-300 ease-in-out inline-block h-7 w-7 m-0.5 rounded-full bg-white shadow-md ${
          theme === 'light' ? 'translate-x-0' : 'translate-x-8'
        }`}
      ></span>
    </button>
  );
};
