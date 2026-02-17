
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onExit: () => void;
  showExit: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onExit, showExit, isDarkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <nav className="w-full h-16 bg-bg-page flex items-center justify-between px-6 md:px-12 fixed top-0 z-50 border-b border-border-subtle/50 backdrop-blur-sm bg-opacity-90">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-action text-2xl">school</span>
          <span className="font-serif font-semibold text-xl tracking-tight text-text-main">Clean Focus</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center justify-center p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-text-muted hover:text-action transition-all"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          {showExit && (
            <button 
              type="button"
              onClick={() => onExit()}
              className="bg-stone-100 dark:bg-stone-800 text-text-muted hover:text-action hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-md transition-all font-sans text-xs font-bold tracking-widest uppercase border border-transparent active:scale-95"
            >
              EXIT
            </button>
          )}
        </div>
      </nav>
      <main className="w-full max-w-[720px] px-4 md:px-0 pt-28 pb-32 flex-grow">
        {children}
      </main>
      <footer className="w-full py-12 flex flex-col items-center justify-center text-text-muted text-xs border-t border-border-subtle/20 mt-auto">
        <p>© 2024 Clean Focus Learning. Designed for deep work.</p>
      </footer>
    </div>
  );
};
