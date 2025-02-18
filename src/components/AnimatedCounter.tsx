import React from 'react';
import { motion } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

interface AnimatedCounterProps {
  value: string;
  label: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, label, className = '' }) => {
  // Parse the numeric value from strings like "82M+", "€4K+", "#1"
  const parseValue = (val: string): number => {
    if (val.startsWith('#')) return parseInt(val.slice(1));
    if (val.startsWith('€')) val = val.slice(1);
    const numericPart = parseFloat(val.replace(/[^0-9.]/g, ''));
    if (val.includes('K')) return numericPart;
    if (val.includes('M')) return numericPart;
    return numericPart;
  };

  // Format the number back to the original format
  const formatValue = (num: number): string => {
    if (value.startsWith('#')) return '#' + Math.round(num);
    
    let formattedNum = Math.round(num);
    if (value.includes('M')) {
      return `${formattedNum}M${value.includes('+') ? '+' : ''}`;
    }
    if (value.includes('K')) {
      return `€${formattedNum}K${value.includes('+') ? '+' : ''}`;
    }
    if (value.startsWith('€')) {
      return `€${formattedNum}${value.includes('+') ? '+' : ''}`;
    }
    return `${formattedNum}${value.includes('+') ? '+' : ''}`;
  };

  const numericValue = parseValue(value);
  const displayValue = useCountUp({ 
    start: 1,
    end: numericValue,
    duration: 2.5
  });

  return (
    <motion.div className={`text-center ${className}`}>
      <div className="text-5xl font-extrabold text-white">
        {formatValue(displayValue)}
      </div>
      <div className="mt-2 text-xl font-medium text-indigo-100">{label}</div>
    </motion.div>
  );
};

export default AnimatedCounter;
