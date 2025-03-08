import React from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';

interface ProgressBarProps {
  value: number;
  label: string;
  color?: string;
  showPercentage?: boolean;
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  label, 
  color = "indigo", 
  showPercentage = true 
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showPercentage && (
          <motion.span 
            className={`text-sm font-medium text-${color}-600`}
            initial={{ opacity: 0, y: 5 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, ...springTransition }}
          >
            <CountUp
              end={value}
              duration={2}
              suffix="%"
              enableScrollSpy
              scrollSpyOnce
            />
          </motion.span>
        )}
      </div>
      <div className={`w-full h-2 bg-${color}-100 rounded-full overflow-hidden`}>
        <motion.div
          className={`h-full bg-${color}-600 rounded-full`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value}%` } : {}}
          transition={{ delay: 0.1, ...springTransition }}
        >
          <motion.div
            className="absolute top-0 right-0 h-full w-2 bg-white/20"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: [0, 1, 0] } : {}}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressBar;
