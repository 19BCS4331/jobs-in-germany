import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

const FlipCard: React.FC<FlipCardProps> = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-full perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyPress={(e) => e.key === 'Enter' && setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
    >
      <motion.div
        className="relative w-full h-full transform-style-3d cursor-pointer"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={springTransition}
      >
        {/* Front */}
        <motion.div
          className={`absolute inset-0 w-full h-full backface-hidden ${
            isFlipped ? 'pointer-events-none' : ''
          }`}
          initial={{ opacity: 1 }}
          animate={{ opacity: isFlipped ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {front}
        </motion.div>

        {/* Back */}
        <motion.div
          className={`absolute inset-0 w-full h-full backface-hidden transform rotate-y-180 ${
            !isFlipped ? 'pointer-events-none' : ''
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFlipped ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {back}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
