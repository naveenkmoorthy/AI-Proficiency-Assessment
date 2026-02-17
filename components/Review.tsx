
import React from 'react';
import { AssessmentResult, Question } from '../types';

interface ReviewProps {
  result: AssessmentResult;
  questions: Question[];
  onStartNew: () => void;
  onRestart: () => void;
}

export const Review: React.FC<ReviewProps> = ({ result, questions, onStartNew, onRestart }) => {
  return (
    <div className="animate-fade-in pb-32">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="bg-border-subtle h-px w-8"></span>
            <span className="text-text-muted text-xs font-bold tracking-widest uppercase">Forensic Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-text-main mb-4">Assessment Review</h1>
          <p className="text-text-muted text-lg max-w-lg leading-relaxed">
            A detailed breakdown of your performance across {result.total} questions in {result.module}.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-action text-surface px-5 py-3 rounded text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Restart
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-surface border border-border-subtle p-5 rounded">
          <p className="text-text-muted text-xs font-bold tracking-widest uppercase mb-1">Total Score</p>
          <p className="font-serif text-3xl text-text-main">{Math.round((result.score / result.total) * 100)}%</p>
        </div>
        <div className="bg-surface border border-border-subtle p-5 rounded">
          <p className="text-text-muted text-xs font-bold tracking-widest uppercase mb-1">Accuracy</p>
          <p className="font-serif text-3xl text-text-main">{result.score}/{result.total}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, idx) => {
          const answer = result.answers.find(a => a.questionId === q.id);
          const selectedOption = q.options.find(o => o.id === answer?.selectedOptionId);
          const correctOption = q.options.find(o => o.id === q.correctOptionId);

          return (
            <details key={q.id} className="group bg-surface border border-border-subtle rounded overflow-hidden hover:border-action/30 transition-colors">
              <summary className="flex cursor-pointer items-start justify-between p-6 gap-4 select-none list-none">
                <div className="flex gap-6 w-full">
                  <span className="font-mono text-text-muted text-sm pt-1">Q{idx + 1}</span>
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-start justify-between gap-4 w-full">
                      <h3 className="font-serif text-lg md:text-xl text-text-main leading-tight group-open:font-medium">
                        {q.text}
                      </h3>
                      <span className="material-symbols-outlined text-text-muted transition-transform duration-300 group-open:rotate-180 shrink-0">expand_more</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 group-open:hidden">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${answer?.isCorrect ? 'bg-success-bg text-success-text border-success-text/10' : 'bg-error-bg text-error-text border-error-text/10'}`}>
                        {answer?.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                </div>
              </summary>
              <div className="px-6 pb-8 ml-0 md:ml-[3.25rem] border-t border-border-subtle/50 mt-2 pt-6">
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-text-muted tracking-widest uppercase">Your Answer</span>
                      <div className={`p-4 border rounded text-sm flex items-start gap-2 ${answer?.isCorrect ? 'bg-success-bg border-success-text/20 text-success-text' : 'bg-error-bg border-error-text/20 text-error-text'}`}>
                        <span className="material-symbols-outlined text-lg shrink-0">{answer?.isCorrect ? 'check' : 'close'}</span>
                        <span>{selectedOption?.text}</span>
                      </div>
                    </div>
                    {!answer?.isCorrect && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-text-muted tracking-widest uppercase">Correct Answer</span>
                        <div className="p-4 bg-success-bg border border-success-text/20 rounded text-success-text font-sans text-sm flex items-start gap-2">
                          <span className="material-symbols-outlined text-lg shrink-0">check</span>
                          <span>{correctOption?.text}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="pl-4 border-l-4 border-action">
                    <span className="text-xs font-bold text-action tracking-widest uppercase block mb-2">Context</span>
                    <p className="text-action text-base leading-relaxed font-sans">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-border-subtle p-6 flex justify-center z-40">
        <button
          onClick={onStartNew}
          className="bg-action hover:bg-action-hover text-surface text-sm font-bold tracking-widest uppercase py-4 px-12 rounded w-full max-w-md shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Finish & Return Home
        </button>
      </div>
    </div>
  );
};
