import React, { useMemo } from 'react';
import { QuestionCategory } from '../types';
import { getQuestionsByCategory } from '../services/questionService';
import { RadioWaveIcon } from './icons/RadioWaveIcon';

interface QuestionsViewScreenProps {
    category: QuestionCategory;
    onBack: () => void;
}

export const QuestionsViewScreen: React.FC<QuestionsViewScreenProps> = ({ category, onBack }) => {
    const questions = useMemo(() => {
        return getQuestionsByCategory(category, 'all');
    }, [category]);

    return (
        <div className="min-h-screen p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
                    <header className="p-6 text-center bg-slate-900/50 border-b border-slate-700">
                        <RadioWaveIcon className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        <h1 className="text-3xl font-bold font-mono text-slate-100">
                            Elenco Domande
                        </h1>
                        <p className="text-2xl font-bold my-4 text-amber-400">{category}</p>
                    </header>
                    <main className="p-6">
                        <div className="space-y-6">
                            {questions.map((question, index) => (
                                <div key={question.id} className="p-4 bg-slate-700/40 rounded-lg border border-slate-600">
                                    <p className="font-semibold text-lg text-slate-200 mb-3">
                                        <span className="font-mono text-amber-400 mr-2">{index + 1}.</span> {question.text}
                                    </p>
                                    <div className="space-y-2 ml-9">
                                        {question.options.map((option, optIndex) => {
                                            const isCorrectAnswer = question.correctAnswer === optIndex;
                                            const optionClass = isCorrectAnswer 
                                                ? 'border-green-500 bg-green-500/20 text-white' 
                                                : 'border-slate-600 bg-slate-800/50 text-slate-300';
                                            
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
                <div className="mt-8 flex justify-center items-center">
                    <button
                        onClick={onBack}
                        className="bg-slate-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-slate-500 transition-colors"
                    >
                        Torna alla Home
                    </button>
                </div>
            </div>
        </div>
    );
};
