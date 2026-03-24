'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
  once?: boolean;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  className = '',
  once = true,
}: FadeInProps) {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 1, 0.5, 1], // Custom spring-like easing 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
