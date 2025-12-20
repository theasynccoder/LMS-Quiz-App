import { useRef } from 'react';
import gsap from 'gsap';
import { Question } from '../App';
import { Check, X, Circle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerClick: (index: number) => void;
  color: string;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswerClick,
  color,
}: QuestionCardProps) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleAnswerClick = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      gsap.to(card, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          onAnswerClick(index);
        },
      });
    }
  };

  const handleMouseEnter = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div className="question-content max-w-4xl w-full">
      {/* Question */}
      <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-gray-700">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm px-3 py-1 rounded-full bg-gray-700 text-gray-300">
            {question.category}
          </span>
          {selectedAnswer !== null && (
            <span className="text-sm px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/50">
              Answered
            </span>
          )}
        </div>
        <h2 className="text-white text-2xl">{question.text}</h2>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const points = option.points;
          
          let bgColor = 'bg-gray-800/50';
          let borderColor = 'border-gray-700';
          let textColor = 'text-white';
          let icon = <Circle size={20} className="text-gray-500" />;

          if (isSelected) {
            if (points === 1) {
              bgColor = 'bg-green-500/20';
              borderColor = 'border-green-500';
              textColor = 'text-green-400';
              icon = <Check size={24} className="text-green-400" />;
            } else if (points === 0.5) {
              bgColor = 'bg-yellow-500/20';
              borderColor = 'border-yellow-500';
              textColor = 'text-yellow-400';
              icon = (
                <div className="text-yellow-400 text-sm px-2 py-1 bg-yellow-500/20 rounded">
                  {points}pt
                </div>
              );
            } else {
              bgColor = 'bg-red-500/20';
              borderColor = 'border-red-500';
              textColor = 'text-red-400';
              icon = <X size={24} className="text-red-400" />;
            }
          }

          return (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`${bgColor} backdrop-blur-sm rounded-xl p-6 border ${borderColor} cursor-pointer transition-colors relative overflow-hidden`}
              onClick={() => handleAnswerClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
              style={{
                boxShadow: isSelected ? `0 0 30px ${color}50` : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <p className={textColor}>{option.text}</p>
                </div>
                <div className="ml-4 flex-shrink-0">{isSelected && icon}</div>
              </div>

              {/* Partial scoring indicator for unanswered questions */}
              {!isSelected && option.points > 0 && option.points < 1 && (
                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                  {option.points}pt
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
