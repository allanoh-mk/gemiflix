'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress, scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  // Transform 0-1 progress to 0-100% width
  const widthPercent = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  // Show bar only after scrolling past 100px
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setVisible(latest > 100);
  });

  // SSR guard
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return (
    <motion.div
      className="scroll-progress-bar fixed top-0 left-0 right-0 z-[9999] h-[3px] rounded-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Gradient trail behind the progress */}
      <div
        className="absolute inset-y-0 left-0 h-full rounded-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--accent-current) 30%, transparent) 40%, color-mix(in srgb, var(--accent-current) 60%, transparent) 80%, var(--accent-current) 100%)',
          width: '100%',
        }}
      />
      {/* Actual progress indicator */}
      <motion.div
        className="scroll-progress-bar absolute inset-y-0 left-0 h-full rounded-none"
        style={{ width: widthPercent }}
      />
    </motion.div>
  );
}
