
export enum AppView {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  REVIEW = 'REVIEW'
}

export enum QuizModule {
  MACHINE_LEARNING = 'Machine Learning',
  NLP = 'Natural Language Processing',
  COMPUTER_VISION = 'Computer Vision',
  GENERATIVE_AI = 'Generative AI'
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
  category: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface AssessmentResult {
  module: QuizModule;
  score: number;
  total: number;
  answers: UserAnswer[];
  qualitativeAnalysis: string;
  completionDate: string;
}
