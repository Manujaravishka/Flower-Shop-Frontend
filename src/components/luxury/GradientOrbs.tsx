import { motion } from "framer-motion";

export type OrbColor =
  | "sage"
  | "rose"
  | "gold"
  | "cream"
  | "lavender"
  | "blush";

interface GradientOrbsProps {
  variant?: "default" | "hero" | "subtle" | "cinematic" | "panel";
  className?: string;
}

interface OrbConfig {
  color: string;
  size: string;
  position: string;
  delay?: number;
  blur?: string;
  opacity?: number;
}

const COLOR_MAP: Record<OrbColor, string> = {
  sage: "radial-gradient(circle, hsl(270 55% 30% / 0.32) 0%, transparent 70%)",
  rose: "radial-gradient(circle, hsl(350 71% 80% / 0.55) 0%, transparent 70%)",
  gold: "radial-gradient(circle, hsl(43 56% 70% / 0.45) 0%, transparent 70%)",
  cream: "radial-gradient(circle, hsl(36 60% 90% / 0.7) 0%, transparent 70%)",
  lavender: "radial-gradient(circle, hsl(260 50% 80% / 0.4) 0%, transparent 70%)",
  blush: "radial-gradient(circle, hsl(8 70% 86% / 0.55) 0%, transparent 70%)",
};

const VARIANTS: Record<string, OrbConfig[]> = {
  default: [
    { color: COLOR_MAP.sage, size: "520px", position: "top-[-12%] left-[-6%]", delay: 0, opacity: 0.5 },
    { color: COLOR_MAP.rose, size: "460px", position: "bottom-[-10%] right-[-6%]", delay: 4, opacity: 0.55 },
    { color: COLOR_MAP.gold, size: "360px", position: "top-[42%] right-[18%]", delay: 8, opacity: 0.4 },
  ],
  hero: [
    { color: COLOR_MAP.sage, size: "780px", position: "top-[-22%] left-[-14%]", delay: 0, opacity: 0.32 },
    { color: COLOR_MAP.rose, size: "680px", position: "bottom-[-18%] right-[-14%]", delay: 3, opacity: 0.55 },
    { color: COLOR_MAP.gold, size: "480px", position: "top-[55%] right-[30%]", delay: 6, opacity: 0.42 },
    { color: COLOR_MAP.cream, size: "420px", position: "bottom-[28%] left-[22%]", delay: 9, opacity: 0.6 },
  ],
  subtle: [
    { color: COLOR_MAP.rose, size: "320px", position: "top-[18%] left-[5%]", delay: 0, opacity: 0.5 },
    { color: COLOR_MAP.gold, size: "300px", position: "bottom-[18%] right-[6%]", delay: 4, opacity: 0.4 },
  ],
  cinematic: [
    { color: COLOR_MAP.rose, size: "900px", position: "top-[-25%] left-[-12%]", delay: 0, opacity: 0.55 },
    { color: COLOR_MAP.gold, size: "780px", position: "bottom-[-22%] right-[-14%]", delay: 5, opacity: 0.4 },
    { color: COLOR_MAP.sage, size: "520px", position: "top-[55%] left-[38%]", delay: 10, opacity: 0.3 },
  ],
  panel: [
    { color: COLOR_MAP.rose, size: "320px", position: "top-[-10%] right-[-6%]", delay: 0, opacity: 0.4 },
    { color: COLOR_MAP.gold, size: "280px", position: "bottom-[-10%] left-[-6%]", delay: 4, opacity: 0.35 },
  ],
};

const GradientOrbs = ({ variant = "default", className = "" }: GradientOrbsProps) => {
  const orbs = VARIANTS[variant] || VARIANTS.default;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: orb.opacity ?? 0.5,
            scale: 1,
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
          }}
          transition={{
            opacity: { duration: 1.5, delay: orb.delay ? orb.delay * 0.1 : 0 },
            scale: { duration: 2 },
            x: { duration: 20 + (orb.delay || 0), repeat: Infinity, ease: "easeInOut" },
            y: { duration: 22 + (orb.delay || 0), repeat: Infinity, ease: "easeInOut" },
          }}
          className={`absolute rounded-full ${orb.position}`}
          style={{
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: `blur(${orb.blur || "80px"})`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};

export default GradientOrbs;
