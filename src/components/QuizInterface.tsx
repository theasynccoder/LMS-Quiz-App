import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { QuizConfig, Question } from '../App';
import { ProgressRing } from './ProgressRing';
import { ScoreCounter } from './ScoreCounter';
import { QuestionCard } from './QuestionCard';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface QuizInterfaceProps {
  config: QuizConfig;
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | null)[];
  score: number;
  onAnswerSelect: (questionIndex: number, answerIndex: number) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onSubmitQuiz: () => void;
}

export function QuizInterface({
  config,
  questions,
  currentQuestionIndex,
  answers,
  score,
  onAnswerSelect,
  onNextQuestion,
  onPreviousQuestion,
  onSubmitQuiz,
}: QuizInterfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const difficultyColors = {
    basic: { primary: '#3B82F6', secondary: '#10B981', particles: '#60A5FA' },
    medium: { primary: '#F59E0B', secondary: '#F97316', particles: '#FBBF24' },
    hard: { primary: '#EF4444', secondary: '#EC4899', particles: '#F87171' },
  };

  const colors = difficultyColors[config.difficultyLevel];
  const selectedAnswer = answers[currentQuestionIndex];
  const isAnswered = selectedAnswer !== null;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = answers.every(answer => answer !== null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.question-content', {
        opacity: 0,
        x: 50,
        duration: 0.5,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [currentQuestionIndex]);

  const handleAnswerClick = (answerIndex: number) => {
    onAnswerSelect(currentQuestionIndex, answerIndex);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <ProgressRing progress={progress} color={colors.primary} />
            <div className="text-white">
              <p className="text-sm text-gray-400">Question</p>
              <p className="text-lg">
                {currentQuestionIndex + 1} / {totalQuestions}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{config.courseName}</p>
            <p className="text-white capitalize">{config.difficultyLevel} Level</p>
          </div>

          <ScoreCounter score={score} maxScore={totalQuestions} color={colors.secondary} />
        </header>

        {/* Question Area */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            onAnswerClick={handleAnswerClick}
            color={colors.primary}
          />
        </main>

        {/* Navigation Footer */}
        <footer className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Dots */}
            <div className="flex justify-center items-center gap-2 mb-6">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className="transition-all duration-300"
                  style={{
                    width: index === currentQuestionIndex ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: answers[index] !== null 
                      ? colors.primary 
                      : index === currentQuestionIndex 
                      ? colors.secondary 
                      : '#4B5563',
                  }}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={onPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white transition-all duration-300 hover:bg-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div className="text-center text-gray-400 text-sm">
                {answers.filter(a => a !== null).length} / {totalQuestions} answered
              </div>

              {isLastQuestion ? (
                <button
                  onClick={onSubmitQuiz}
                  disabled={!allAnswered}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: allAnswered ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : '#4B5563',
                    boxShadow: allAnswered ? `0 10px 30px ${colors.primary}50` : 'none',
                  }}
                >
                  <Send size={20} />
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={onNextQuestion}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    boxShadow: `0 10px 30px ${colors.primary}50`,
                  }}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}