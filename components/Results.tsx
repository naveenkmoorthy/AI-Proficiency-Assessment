
import React from 'react';
import { AssessmentResult, AppView } from '../types';

interface ResultsProps {
  result: AssessmentResult;
  onNavigate: (view: AppView) => void;
  onRestart: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onNavigate, onRestart }) => {
  const percentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="animate-fade-in">
      <div className="bg-surface border border-border-subtle rounded overflow-hidden flex flex-col md:flex-row shadow-sm">
        {/* Score Side */}
        <div className="bg-stone-50 dark:bg-stone-900/50 md:w-2/5 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-border-subtle">
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Final Score</span>
          <h2 className="text-7xl md:text-8xl font-serif text-text-main leading-none mb-6">
            {percentage}%
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-success-bg border border-success-text/20 rounded text-success-text text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {result.score}/{result.total} Correct
          </div>
          <p className="text-text-muted text-xs mt-6">
            Completed on {result.completionDate}
          </p>
        </div>

        {/* Content Side */}
        <div className="md:w-3/5 p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-action text-xl">psychology</span>
            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Assessment Analysis</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-text-main mb-6 leading-tight">
            {percentage >= 80 ? 'Exemplary Performance' : percentage >= 60 ? 'Strong Potential' : 'Room for Growth'}
          </h1>
          <p className="text-text-muted text-lg leading-relaxed mb-10 font-sans">
            {result.qualitativeAnalysis}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => onNavigate(AppView.REVIEW)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-action px-6 py-4 text-xs font-bold uppercase tracking-widest text-action hover:bg-stone-50 dark:hover:bg-stone-900 transition-colors"
            >
              Review
              <span className="material-symbols-outlined text-[16px]">visibility</span>
            </button>
            <button
              onClick={onRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-action px-6 py-4 text-xs font-bold uppercase tracking-widest text-surface hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
            >
              Restart
              <span className="material-symbols-outlined text-[16px]">refresh</span>
            </button>
            <button
              onClick={() => onNavigate(AppView.HOME)}
              className="flex items-center gap-2 text-text-muted hover:text-action transition-colors text-xs font-bold uppercase tracking-widest ml-auto"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
