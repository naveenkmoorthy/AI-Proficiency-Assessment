
import React, { useState, useEffect, useCallback } from 'react';
import { Home } from './components/Home';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { Review } from './components/Review';
import { Layout } from './components/Layout';
import { AppView, QuizModule, Question, UserAnswer, AssessmentResult } from './types';
import { getAssessment, generateQualitativeAnalysis } from './services/assessmentService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [module, setModule] = useState<QuizModule | null>(null);
  const [scholarName, setScholarName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [quizKey, setQuizKey] = useState(0); 
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('clean-focus-theme');
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('clean-focus-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('clean-focus-theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleStart = async (selectedModule: QuizModule, name: string) => {
    setLoading(true);
    setModule(selectedModule);
    setScholarName(name);
    try {
      const fetchedQuestions = await getAssessment(selectedModule);
      setQuestions(fetchedQuestions);
      setResults(null);
      setQuizKey(Date.now()); // Ensure unique key for fresh state
      setView(AppView.QUIZ);
    } catch (error) {
      console.error(error);
      alert("Failed to load assessment questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = useCallback(async () => {
    if (!module) return;
    
    setLoading(true);
    try {
      const fetchedQuestions = await getAssessment(module);
      setQuestions(fetchedQuestions);
      setResults(null);
      setQuizKey(Date.now()); // Crucial: forces Quiz to completely unmount/remount
      setView(AppView.QUIZ);
    } catch (error) {
      console.error(error);
      alert("Failed to restart assessment.");
    } finally {
      setLoading(false);
    }
  }, [module]);

  const handleExit = useCallback(() => {
    setModule(null);
    setQuestions([]);
    setResults(null);
    setQuizKey(0);
    setView(AppView.HOME);
  }, []);

  const handleQuizComplete = async (answers: UserAnswer[]) => {
    setLoading(true);
    const score = answers.filter(a => a.isCorrect).length;
    const total = answers.length;
    
    try {
      const qualitativeAnalysis = await generateQualitativeAnalysis(module!, score, total);
      const result: AssessmentResult = {
        module: module!,
        score,
        total,
        answers,
        qualitativeAnalysis,
        completionDate: new Date().toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }),
      };
      setResults(result);
      setView(AppView.RESULTS);
    } catch (error) {
      console.error(error);
      const fallbackResult: AssessmentResult = {
        module: module!,
        score,
        total,
        answers,
        qualitativeAnalysis: "Assessment complete. You've demonstrated active engagement with the material.",
        completionDate: new Date().toLocaleDateString()
      };
      setResults(fallbackResult);
      setView(AppView.RESULTS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      onExit={handleExit} 
      showExit={view !== AppView.HOME} 
      isDarkMode={isDarkMode} 
      toggleDarkMode={toggleDarkMode}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
          <span className="material-symbols-outlined text-6xl text-stone-300 dark:text-stone-700 animate-spin mb-4">
            progress_activity
          </span>
          <p className="text-text-muted font-serif italic text-lg">Curating your experience...</p>
        </div>
      ) : (
        <>
          {view === AppView.HOME && <Home onStart={handleStart} />}
          {view === AppView.QUIZ && questions.length > 0 && (
            <Quiz 
              key={quizKey} 
              questions={questions} 
              onComplete={handleQuizComplete} 
              onRestart={handleRestart}
            />
          )}
          {view === AppView.RESULTS && results && (
            <Results 
              result={results} 
              onNavigate={(v) => setView(v)} 
              onRestart={handleRestart}
            />
          )}
          {view === AppView.REVIEW && results && (
            <Review 
              result={results} 
              questions={questions} 
              onStartNew={() => setView(AppView.HOME)}
              onRestart={handleRestart}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
