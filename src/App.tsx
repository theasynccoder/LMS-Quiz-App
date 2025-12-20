import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { CreateQuizForm } from './components/CreateQuizForm';
import { QuizInterface } from './components/QuizInterface';
import { ResultsScreen } from './components/ResultsScreen';
import './styles/globals.css';

export type Difficulty = 'basic' | 'medium' | 'hard';

export interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    points: number;
  }[];
  category: string;
  correctAnswer?: number;
}

export interface QuizConfig {
  courseName: string;
  courseDescription?: string;
  numberOfQuestions: number;
  includeVideo: boolean;
  difficultyLevel: Difficulty;
  category: string;
}

export interface QuizState {
  config: QuizConfig | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  score: number;
  showResults: boolean;
}

export type AppScreen = 'landing' | 'create' | 'quiz' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [quizState, setQuizState] = useState<QuizState>({
    config: null,
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    score: 0,
    showResults: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateQuiz = () => {
    setCurrentScreen('create');
  };

  const handleGenerateQuiz = async (config: QuizConfig, questions: Question[]) => {
    setIsLoading(true);
    
    try {
      // Initialize quiz state with generated questions
      setQuizState({
        config,
        questions,
        currentQuestionIndex: 0,
        answers: new Array(questions.length).fill(null),
        score: 0,
        showResults: false,
      });
      
      setCurrentScreen('quiz');
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const question = quizState.questions[questionIndex];
    const points = question.options[answerIndex].points;
    
    setQuizState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[questionIndex] = answerIndex;
      
      // Calculate total score
      let totalScore = 0;
      newAnswers.forEach((answer, idx) => {
        if (answer !== null) {
          totalScore += prev.questions[idx].options[answer].points;
        }
      });
      
      return {
        ...prev,
        answers: newAnswers,
        score: totalScore,
      };
    });
  };

  const handleNextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
    }));
  };

  const handlePreviousQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  };

  const handleSubmitQuiz = () => {
    console.log('Submitting quiz with state:', {
      config: quizState.config,
      questionsCount: quizState.questions.length,
      answersCount: quizState.answers.length,
      score: quizState.score,
    });
    
    setQuizState(prev => ({
      ...prev,
      showResults: true,
    }));
    setCurrentScreen('results');
  };

  const handleRestart = () => {
    setQuizState({
      config: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      showResults: false,
    });
    setCurrentScreen('landing');
  };

  const handleBackToForm = () => {
    setCurrentScreen('create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 transition-colors duration-1000">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] animate-pulse"></div>
      </div>

      {/* Screen Content */}
      <div className="relative z-10">
        {currentScreen === 'landing' && (
          <LandingPage onCreateQuiz={handleCreateQuiz} />
        )}

        {currentScreen === 'create' && (
          <CreateQuizForm
            onGenerateQuiz={handleGenerateQuiz}
            isLoading={isLoading}
            onBack={() => setCurrentScreen('landing')}
          />
        )}

        {currentScreen === 'results' && (
          quizState.config && quizState.questions.length > 0 ? (
            <ResultsScreen
              config={quizState.config}
              score={quizState.score}
              totalQuestions={quizState.questions.length}
              answers={quizState.answers}
              questions={quizState.questions}
              onRestart={handleRestart}
              onBackToForm={handleBackToForm}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-white text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
                <h1 className="text-2xl mb-4">Loading Results...</h1>
                <p className="text-gray-400 mb-4">
                  {!quizState.config && 'Quiz configuration not found. '}
                  {quizState.questions.length === 0 && 'No questions found. '}
                </p>
                <button
                  onClick={handleRestart}
                  className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700 transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          )
        )}

        {currentScreen === 'quiz' && quizState.config && (
          <QuizInterface
            config={quizState.config}
            questions={quizState.questions}
            currentQuestionIndex={quizState.currentQuestionIndex}
            answers={quizState.answers}
            score={quizState.score}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
            onPreviousQuestion={handlePreviousQuestion}
            onSubmitQuiz={handleSubmitQuiz}
          />
        )}
      </div>
    </div>
  );
}