import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BookOpen, Sparkles, Brain, Zap } from 'lucide-react';

interface LandingPageProps {
  onCreateQuiz: () => void;
}

export function LandingPage({ onCreateQuiz }: LandingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state and animate
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
      );

      gsap.fromTo(buttonRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.8, delay: 0.4, ease: 'back.out(1.7)' }
      );

      gsap.fromTo('.feature-card',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, delay: 0.6, ease: 'back.out(1.7)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleButtonHover = () => {
    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-5xl w-full text-center">
          {/* Header */}
          <div className="mb-12">
            <h1 ref={titleRef} className="text-white mb-4 text-6xl font-bold">
              Interactive Quiz Generator
            </h1>
            <p ref={subtitleRef} className="text-gray-300 text-xl max-w-3xl mx-auto">
              Create intelligent, interactive quizzes with stunning animations
            </p>
          </div>

          {/* Create Quiz Button */}
          <button
            ref={buttonRef}
            onClick={onCreateQuiz}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            className="mb-16 px-12 py-6 rounded-2xl text-white text-xl inline-flex items-center gap-4 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
              boxShadow: '0 20px 60px rgba(139, 92, 246, 0.5)',
            }}
          >
            <Sparkles size={28} />
            Create Quiz
            <Sparkles size={28} />
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain size={28} color="#8B5CF6" />
              </div>
              <h3 className="text-white mb-2">Smart Content Generation</h3>
              <p className="text-gray-400 text-sm">
                Dynamically create relevant, challenging questions for any topic
              </p>
            </div>

            <div className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <BookOpen size={28} color="#3B82F6" />
              </div>
              <h3 className="text-white mb-2">Custom Categories</h3>
              <p className="text-gray-400 text-sm">
                Generate quizzes for any subject, topic, or skill level
              </p>
            </div>

            <div className="feature-card bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="w-14 h-14 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap size={28} color="#EC4899" />
              </div>
              <h3 className="text-white mb-2">Interactive Experience</h3>
              <p className="text-gray-400 text-sm">
                Beautiful animations and visual effects enhance learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}