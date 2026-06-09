import { motion, useInView } from "framer-motion";
import { ReactNode, useRef, CSSProperties } from "react";

interface MotionSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
  duration?: number;
  once?: boolean;
  style?: CSSProperties;
  as?: "div" | "section" | "article" | "header" | "main";
}

const directionMap = {
  up: { y: 32, x: 0, scale: 1 },
  down: { y: -32, x: 0, scale: 1 },
  left: { y: 0, x: 32, scale: 1 },
  right: { y: 0, x: -32, scale: 1 },
  scale: { y: 0, x: 0, scale: 0.95 },
  fade: { y: 0, x: 0, scale: 1 },
};

const MotionSection = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.8,
  once = true,
  style,
  as = "div",
}: MotionSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-80px 0px -80px 0px" });
  const offset = directionMap[direction];

  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      initial={{ opacity: 0, y: offset.y, x: offset.x, scale: offset.scale }}
      animate={
        isInView
          ? { opacity: 1, y: 0, x: 0, scale: 1 }
          : { opacity: 0, y: offset.y, x: offset.x, scale: offset.scale }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
};

export default MotionSection;
