import { motion, useReducedMotion } from "framer-motion";

const softEaseOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/** Variants shared between FadeInItem children. */
const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: softEaseOut },
  },
};

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
}

interface PageFadeInProps extends FadeInProps {
  /** Delay (seconds) before the first child starts animating. Default 0.05. */
  delay?: number;
}

/**
 * Stagger container for page-level content sections.
 * Wrap top-level sections inside this, then use <FadeInItem> per section/card.
 */
export function PageFadeIn({ children, className, delay = 0.05 }: PageFadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Individual stagger item. Place inside <PageFadeIn> for a staggered fade-up,
 * or use standalone for a simple single-block fade-in.
 */
export function FadeInItem({ children, className }: FadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={itemVariants}
    >
      {children}
    </motion.div>
  );
}
