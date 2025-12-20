import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import gsap from 'gsap';

interface TimerProps {
  duration: number;
  color: string;
}

export function Timer({ duration, color }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeLeft(duration);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0 && timerRef.current) {
      gsap.to(timerRef.current, {
        scale: 1.1,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut',
      });
    }
  }, [timeLeft]);

  const isLowTime = timeLeft <= 10;

  return (
    <div
      ref={timerRef}
      className="flex items-center gap-3 bg-gray-800/50 backdrop-blur-sm px-6 py-3 rounded-xl border border-gray-700"
      style={{
        borderColor: isLowTime ? '#EF4444' : '#374151',
      }}
    >
      <Clock
        size={24}
        color={isLowTime ? '#EF4444' : color}
        style={{ filter: `drop-shadow(0 0 8px ${isLowTime ? '#EF4444' : color}80)` }}
      />
      <div>
        <p className="text-sm text-gray-400">Time</p>
        <p
          className="text-2xl"
          style={{ color: isLowTime ? '#EF4444' : color }}
        >
          {timeLeft}s
        </p>
      </div>
    </div>
  );
}
