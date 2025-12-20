import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ProgressRingProps {
  progress: number;
  color: string;
}

export function ProgressRing({ progress, color }: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (circleRef.current) {
      const offset = circumference - (progress / 100) * circumference;
      
      gsap.to(circleRef.current, {
        strokeDashoffset: offset,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  }, [progress, circumference]);

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#374151"
          strokeWidth="4"
        />
        <circle
          ref={circleRef}
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
