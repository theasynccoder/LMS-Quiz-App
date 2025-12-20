import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Trophy } from 'lucide-react';

interface ScoreCounterProps {
  score: number;
  maxScore: number;
  color: string;
}

export function ScoreCounter({ score, maxScore, color }: ScoreCounterProps) {
  const scoreRef = useRef<HTMLDivElement>(null);
  const previousScore = useRef(0);

  useEffect(() => {
    if (scoreRef.current && score !== previousScore.current) {
      // Animate score increase
      gsap.to(scoreRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });

      // Particle burst effect (simulated with multiple divs)
      const particles = 8;
      for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'score-particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${color};
          top: 50%;
          left: 50%;
          pointer-events: none;
        `;
        scoreRef.current?.appendChild(particle);

        const angle = (i / particles) * Math.PI * 2;
        const distance = 30;

        gsap.to(particle, {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => particle.remove(),
        });
      }

      previousScore.current = score;
    }
  }, [score, color]);

  return (
    <div className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700">
      <Trophy size={24} color={color} style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
      <div ref={scoreRef} className="text-white relative">
        <p className="text-sm text-gray-400">Score</p>
        <p className="text-2xl" style={{ color }}>
          {score.toFixed(1)} / {maxScore}
        </p>
      </div>
    </div>
  );
}
