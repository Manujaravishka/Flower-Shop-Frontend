import { ReactNode, CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  style?: CSSProperties;
  duration?: number;
}

const directionMap = {
  up: { y: 32, x: 0, scale: 1 },
  down: { y: -32, x: 0, scale: 1 },
  left: { y: 0, x: 32, scale: 1 },
  right: { y: 0, x: -32, scale: 1 },
  scale: { y: 0, x: 0, scale: 0.95 },
  fade: { y: 0, x: 0, scale: 1 },
};

// Backwards-compatible AnimatedSection powered by framer-motion
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  style,
  duration = 0.7,
}: AnimatedSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const offset = directionMap[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: offset.y, x: offset.x, scale: offset.scale }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0, scale: 1 }
          : { opacity: 0, y: offset.y, x: offset.x, scale: offset.scale }
      }
      transition={{
        duration,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
