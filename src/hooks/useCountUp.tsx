import { useEffect, useState } from 'react';
import { useSpring, animate } from 'framer-motion';

interface CountUpOptions {
  start?: number;
  end: number;
  duration?: number;
  delay?: number;
}

export const useCountUp = ({ start = 1, end, duration = 2, delay = 0 }: CountUpOptions) => {
  const [displayValue, setDisplayValue] = useState(start);

  useEffect(() => {
    const controls = animate(start, end, {
      duration,
      delay,
      onUpdate: (value) => {
        setDisplayValue(value);
      },
      ease: "easeOut"
    });

    return () => controls.stop();
  }, [start, end, duration, delay]);

  return displayValue;
};
