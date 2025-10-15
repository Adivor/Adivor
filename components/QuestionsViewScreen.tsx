import React, { useMemo, useState, useEffect } from 'react';
import { QuestionCategory } from '../types';
import { getQuestionsByCategory } from '../services/questionService';
import { RadioWaveIcon } from './icons/RadioWaveIcon';
import { HomeIcon } from './icons/HomeIcon';
import { SearchIcon } from './icons/SearchIcon';

interface QuestionsViewScreenProps {
    category: QuestionCategory;
    onBack: () => void;
}

export const QuestionsViewScreen: React.FC<QuestionsViewScreenProps> = ({ category, onBack }) => {
    const allQuestions = useMemo(() => {
        // Sort by ID for a consistent order instead of the shuffled one
        return getQuestionsByCategory(category, 'all').sort((a, b) => a.id - b.id);
    }, [category]);

    const [showFab, setShowFab] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredQuestions = useMemo(() => {
        if (!searchTerm.trim()) {
            return allQuestions;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return allQuestions.filter(q => 
            q.text.toLowerCase().includes(lowercasedTerm) ||
            q.options.some(opt => opt.toLowerCase().includes(lowercasedTerm))
        );
    }, [allQuestions, searchTerm]);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down a bit (e.g., 300px)
            if (window.scrollY > 300) {
                setShowFab(true);
            } else {
                setShowFab(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className="p-4 sm:p-6 md:p-8">
                <div className="max-w-4xl mx-auto pb-24"> {/* Added padding-bottom to ensure FAB doesn't cover last item */}
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <header className="p-6 text-center bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                            <RadioWaveIcon className="w-16 h-16 mx-auto mb-4 text-amber-500 dark:text-amber-400" />
                            <h1 className="text-3xl font-bold font-mono text-slate-900 dark:text-slate-100">
                                Elenco Domande
                            </h1>
                            <p className="text-2xl font-bold my-4 text-amber-600 dark:text-amber-400">{category}</p>
                        </header>
                        <main className="p-6">
                            <div className="mb-8">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                        <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    </span>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Cerca per parola chiave..."
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400 outline-none transition-colors"
                                        aria-label="Cerca domande"
                                    />
                                </div>
                                <p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-2">
                                    Trovate {filteredQuestions.length} su {allQuestions.length} domande
                                </p>
                            </div>
                            <div className="space-y-6">
                                {filteredQuestions.map((question) => (
                                    <div key={question.id} className="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-lg border border-slate-200 dark:border-slate-600">
                                        <p className="font-semibold text-lg text-slate-800 dark:text-slate-200 mb-3">
                                            <span className="font-mono text-amber-600 dark:text-amber-400 mr-2">{allQuestions.findIndex(q => q.id === question.id) + 1}.</span> {question.text}
                                        </p>
                                        <div className="space-y-2 ml-9">
                                            {question.options.map((option, optIndex) => {
                                                const isCorrectAnswer = question.correctAnswer === optIndex;
                                                const optionClass = isCorrectAnswer 
                                                    ? 'border-green-500 bg-green-50 text-green-800 dark:border-green-500 dark:bg-green-500/20 dark:text-white' 
                                                    : 'border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300';
                                                
                                                return (
                                                    <div key={optIndex} className={`p-3 rounded border ${optionClass} flex items-center`}>
                                                        <span className="font-mono mr-3">{String.fromCharCode(65 + optIndex)}.</span>
                                                        <span>{option}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            
            <button
                onClick={onBack}
                title="Torna alla Home"
                aria-label="Torna alla Home"
                className={`fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-amber-500 text-slate-900 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110 hover:bg-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-300
                ${showFab ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}
            >
                <HomeIcon className="w-8 h-8" />
            </button>
        </>
    );
};