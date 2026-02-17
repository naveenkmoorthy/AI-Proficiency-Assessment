
import React, { useState } from 'react';
import { Question, Option, UserAnswer } from '../types';

interface QuizProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  onRestart: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleOptionClick = (optionId: string) => {
    if (isAnswered) return;
    setSelectedId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedId) return;
    
    const isCorrect = selectedId === currentQuestion.correctOptionId;
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedId,
      isCorrect,
    };

    setUserAnswers([...userAnswers, answer]);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedId(null);
      setIsAnswered(false);
    } else {
      onComplete([...userAnswers]);
    }
  };

  return (
    <div className="flex flex-col animate-fade-in">
      {/* Progress & Metadata */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-text-muted">
          <span>Question {String(currentIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
          <span>{currentQuestion.category}</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-border-subtle">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <h2 className="mb-12 text-3xl font-light leading-tight text-text-main font-serif md:text-4xl">
        {currentQuestion.text}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-4 mb-10">
        {currentQuestion.options.map((option) => {
          let className = "relative flex w-full items-start gap-5 p-5 md:p-6 border rounded transition-all text-left ";
          
          if (isAnswered) {
            if (option.id === currentQuestion.correctOptionId) {
              className += "bg-success-bg border-success-text text-success-text";
            } else if (option.id === selectedId) {
              className += "bg-error-bg border-error-text text-error-text";
            } else {
              className += "bg-surface border-border-subtle opacity-50";
            }
          } else {
            className += selectedId === option.id 
              ? "bg-stone-50 dark:bg-stone-900 border-action" 
              : "bg-surface border-border-subtle hover:border-stone-400";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={isAnswered}
              className={className}
            >
              <span className="font-mono text-sm pt-1 opacity-60">{option.id}.</span>
              <span className="font-sans text-lg flex-1 leading-relaxed">{option.text}</span>
              {isAnswered && option.id === currentQuestion.correctOptionId && (
                <span className="material-symbols-outlined">check_circle</span>
              )}
              {isAnswered && option.id === selectedId && option.id !== currentQuestion.correctOptionId && (
                <span className="material-symbols-outlined">cancel</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Context Block */}
      {isAnswered && (
        <div className="animate-fade-in mb-10 pl-6 border-l-4 border-action bg-transparent py-2">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Context</span>
            <p className="text-lg leading-relaxed text-action font-sans">
              {currentQuestion.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border-subtle/30">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 border border-border-subtle rounded text-text-muted hover:text-action hover:border-action transition-all text-xs font-bold uppercase tracking-widest bg-surface"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Restart
        </button>

        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className={`flex items-center gap-2 rounded bg-action px-8 py-4 text-sm font-bold uppercase tracking-widest text-surface transition-all shadow-lg ${!selectedId ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 rounded bg-action px-8 py-4 text-sm font-bold uppercase tracking-widest text-surface transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};
