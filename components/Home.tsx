
import React, { useState } from 'react';
import { QuizModule } from '../types';

interface HomeProps {
  onStart: (module: QuizModule, name: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const modules = [
    { id: QuizModule.MACHINE_LEARNING, icon: 'settings', label: 'Machine Learning' },
    { id: QuizModule.NLP, icon: 'forum', label: 'Natural Language Processing' },
    { id: QuizModule.COMPUTER_VISION, icon: 'visibility', label: 'Computer Vision' },
    { id: QuizModule.GENERATIVE_AI, icon: 'auto_awesome', label: 'Generative AI' },
  ];

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-serif text-text-main mb-6">AI Proficiency Assessment</h1>
        <p className="text-text-muted text-lg font-sans">Select a module to begin your evaluation.</p>
      </div>

      <div className="w-full max-w-md mb-12">
        <label className="block text-xs font-bold text-text-muted tracking-widest uppercase mb-2">
          Scholar Name (Optional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name..."
          className="w-full p-4 border border-border-subtle bg-surface text-text-main rounded focus:outline-none focus:border-action transition-colors placeholder-stone-300 dark:placeholder-stone-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => onStart(mod.id, name)}
            className="flex flex-col items-center justify-center p-8 bg-surface border border-border-subtle rounded hover:border-action transition-all group"
          >
            <span className="material-symbols-outlined text-text-muted text-4xl mb-4 group-hover:text-action transition-colors">
              {mod.icon}
            </span>
            <span className="font-serif text-base text-text-main text-center leading-tight">
              {mod.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
