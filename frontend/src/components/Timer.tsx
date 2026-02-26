import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: number) => void;
  resetTrigger?: number;
}

export function Timer({ isRunning, onTimeUpdate, resetTrigger }: TimerProps) {
  const { t } = useTranslation();
  const [time, setTime] = useState(0);

  useEffect(() => {
    setTime(0);
  }, [resetTrigger]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 10; // Update every 10ms for smooth display
          onTimeUpdate?.(newTime);
          return newTime;
        });
      }, 10);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 text-sm sm:text-base md:text-lg font-mono">
      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
      <span className="font-bold text-primary">
        {formatTime(time)}
      </span>
    </div>
  );
}
