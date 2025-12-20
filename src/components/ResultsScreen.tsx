import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { QuizConfig, Question } from '../App';
import { Trophy, RotateCcw, Award, Star, Edit } from 'lucide-react';

interface ResultsScreenProps {
  config: QuizConfig;
  score: number;
  totalQuestions: number;
  answers: (number | null)[];
  questions: Question[];
  onRestart: () => void;
  onBackToForm: () => void;
}

export function ResultsScreen({
  config,
  score,
  totalQuestions,
  answers,
  questions,
  onRestart,
  onBackToForm,
}: ResultsScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  // Defensive checks
  if (!config || !questions || questions.length === 0) {
    console.error('ResultsScreen: Missing required data', { config, questions, totalQuestions });
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl mb-4">Error: Quiz data not found</h1>
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-blue-600 rounded-xl text-white hover:bg-blue-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
  const passed = percentage >= 60;

  const difficultyColors = {
    basic: { primary: '#3B82F6', secondary: '#10B981' },
    medium: { primary: '#F59E0B', secondary: '#F97316' },
    hard: { primary: '#EF4444', secondary: '#EC4899' },
  };

  const colors = difficultyColors[config.difficultyLevel];

  const getGrade = () => {
    if (percentage >= 90) return { letter: 'A+', message: 'Outstanding!' };
    if (percentage >= 80) return { letter: 'A', message: 'Excellent!' };
    if (percentage >= 70) return { letter: 'B', message: 'Great Job!' };
    if (percentage >= 60) return { letter: 'C', message: 'Good Effort!' };
    if (percentage >= 50) return { letter: 'D', message: 'Keep Practicing!' };
    return { letter: 'F', message: 'Try Again!' };
  };

  const grade = getGrade();

  const correctAnswers = answers.filter((answer, index) => {
    if (answer === null || !questions[index] || !questions[index].options[answer]) return false;
    return questions[index].options[answer].points === 1;
  }).length;

  const partialAnswers = answers.filter((answer, index) => {
    if (answer === null || !questions[index] || !questions[index].options[answer]) return false;
    return questions[index].options[answer].points === 0.5;
  }).length;

  const incorrectAnswers = answers.filter((answer, index) => {
    if (!questions[index]) return false;
    if (answer === null) return true;
    if (!questions[index].options[answer]) return true;
    return questions[index].options[answer].points === 0;
  }).length;

  useEffect(() => {
    // Scroll to top when results screen loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('Results Screen Data:', {
      score,
      totalQuestions,
      percentage,
      correctAnswers,
      partialAnswers,
      incorrectAnswers,
      config
    });
    
    // Ensure all content is visible by default (fallback)
    const ensureVisibility = () => {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('.trophy-container, .grade-display, .stat-card, .action-button, .quiz-details');
        elements.forEach(el => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style.opacity === '0' || htmlEl.style.opacity === '') {
            htmlEl.style.opacity = '1';
          }
        });
        if (scoreRef.current) {
          if (scoreRef.current.style.opacity === '0' || scoreRef.current.style.opacity === '') {
            scoreRef.current.style.opacity = '1';
            scoreRef.current.style.transform = 'scale(1)';
          }
        }
      }
    };

    // Set a timeout to ensure visibility even if GSAP fails
    const visibilityTimeout = setTimeout(ensureVisibility, 100);
    
    try {
      const ctx = gsap.context(() => {
        // Use fromTo to ensure we animate from hidden to visible
        // This way content is visible by default (via inline styles) and only animates if GSAP works
        gsap.fromTo('.trophy-container', 
          { scale: 0, rotation: 180 },
          { scale: 1, rotation: 0, duration: 1, ease: 'back.out(1.7)' }
        );

        if (scoreRef.current) {
          gsap.fromTo(scoreRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, delay: 0.3, ease: 'back.out(1.7)' }
          );
        }

        gsap.fromTo('.grade-display',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' }
        );

        gsap.fromTo('.stat-card',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, delay: 0.7, ease: 'back.out(1.7)' }
        );

        gsap.fromTo('.action-button',
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, delay: 1, ease: 'back.out(1.7)' }
        );

        gsap.fromTo('.quiz-details',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, delay: 1.2, ease: 'power3.out' }
        );
      }, containerRef);

      return () => {
        clearTimeout(visibilityTimeout);
        ctx.revert();
      };
    } catch (error) {
      console.error('GSAP animation error:', error);
      clearTimeout(visibilityTimeout);
      ensureVisibility();
    }
  }, [score, totalQuestions, percentage, correctAnswers, partialAnswers, incorrectAnswers, config]);

  const calculateStars = () => {
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    return 1;
  };

  const stars = calculateStars();

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Trophy Icon */}
          <div className="trophy-container flex justify-center mb-8" style={{ opacity: 1, transform: 'scale(1) rotate(0deg)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: passed ? `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` : 'linear-gradient(135deg, #6B7280, #4B5563)',
                boxShadow: passed ? `0 20px 60px ${colors.primary}80` : '0 20px 60px rgba(0,0,0,0.3)',
              }}
            >
              <Trophy size={48} className="text-white" />
            </div>
          </div>

          {/* Score Display */}
          <div ref={scoreRef} className="text-center mb-8" style={{ opacity: 1, transform: 'scale(1)' }}>
            <h1 className="text-white mb-2 text-4xl font-bold">Quiz Complete!</h1>
            <p className="text-gray-400 text-xl mb-6">{config.courseName}</p>
            
            <div className="inline-block px-8 py-6 bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-700 mb-6">
              <div className="text-6xl font-bold text-white mb-2">
                {score.toFixed(1)} / {totalQuestions}
              </div>
              <div className="text-2xl text-gray-400">
                {percentage.toFixed(1)}%
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={32}
                  fill={index < stars ? colors.primary : 'transparent'}
                  color={index < stars ? colors.primary : '#4B5563'}
                  className="transition-all duration-300"
                />
              ))}
            </div>
          </div>

          {/* Grade Display */}
          <div className="grade-display text-center mb-8" style={{ opacity: 1, transform: 'translateY(0)' }}>
            <div className="inline-block px-12 py-6 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                border: `2px solid ${colors.primary}`,
              }}
            >
              <div className="text-5xl font-bold text-white mb-2">{grade.letter}</div>
              <div className="text-xl text-gray-300">{grade.message}</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stat-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center" style={{ opacity: 1, transform: 'translateY(0)' }}>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <Award size={24} color="#10B981" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{correctAnswers}</div>
              <div className="text-gray-400">Correct</div>
            </div>

            <div className="stat-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center" style={{ opacity: 1, transform: 'translateY(0)' }}>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                <Star size={24} color="#F59E0B" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{partialAnswers}</div>
              <div className="text-gray-400">Partial</div>
            </div>

            <div className="stat-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 text-center" style={{ opacity: 1, transform: 'translateY(0)' }}>
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-3">
                <Award size={24} color="#EF4444" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{incorrectAnswers}</div>
              <div className="text-gray-400">Incorrect</div>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="quiz-details bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8" style={{ opacity: 1, transform: 'translateY(0)' }}>
            <h3 className="text-white mb-4">Quiz Details</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div>
                <p className="text-gray-400 text-sm">Course</p>
                <p className="text-white">{config.courseName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Difficulty</p>
                <p className="text-white capitalize">{config.difficultyLevel}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Category</p>
                <p className="text-white">{config.category}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Questions</p>
                <p className="text-white">{totalQuestions}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onBackToForm}
              className="action-button flex items-center gap-2 px-6 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl text-white transition-all duration-300 hover:bg-gray-700/50"
              style={{ opacity: 1, transform: 'scale(1)' }}
            >
              <Edit size={20} />
              New Quiz
            </button>

            <button
              onClick={onRestart}
              className="action-button flex items-center gap-2 px-8 py-3 rounded-xl text-white transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                boxShadow: `0 10px 30px ${colors.primary}50`,
                opacity: 1,
                transform: 'scale(1)',
              }}
            >
              <RotateCcw size={20} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}