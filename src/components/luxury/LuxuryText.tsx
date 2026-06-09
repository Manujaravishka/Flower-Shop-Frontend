import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LuxuryTextProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
  delay?: number;
  stagger?: boolean;
}

const LuxuryText = ({
  children,
  as = "h2",
  className = "",
  delay = 0,
  stagger = false,
}: LuxuryTextProps) => {
  const Tag = motion[as] as typeof motion.h2;
  const text = String(children);

  if (!stagger) {
    return (
      <Tag
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
      >
        {children}
      </Tag>
    );
  }

  // Word-by-word stagger
  const words = text.split(" ");
  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.1em" }}
        >
          <motion.span
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}&nbsp;
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default LuxuryText;
