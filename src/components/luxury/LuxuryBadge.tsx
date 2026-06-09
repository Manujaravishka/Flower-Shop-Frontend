import { motion } from "framer-motion";
import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "subtle" | "premium" | "gold";

interface LuxuryBadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default:
    "bg-white/80 backdrop-blur-md border border-cream-200 text-foreground/85",
  outline: "bg-transparent border border-primary/25 text-primary",
  subtle: "bg-cream-100/80 border border-cream-200 text-muted-foreground",
  premium:
    "bg-gradient-to-r from-primary/[0.08] via-rose/15 to-primary/[0.08] border border-primary/20 text-primary",
  gold: "border border-gold/40 text-gold",
  // bg-gold/10 not used, use inline style
  // fallback noop
} as any;

const goldStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(200, 162, 74, 0.15), rgba(200, 162, 74, 0.08))",
};

const LuxuryBadge = ({
  children,
  variant = "default",
  icon,
  className = "",
  ...rest
}: LuxuryBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em]",
        variantStyles[variant],
        className
      )}
      style={variant === "gold" ? goldStyle : undefined}
      {...(rest as any)}
    >
      {icon}
      {children}
    </motion.div>
  );
};

export default LuxuryBadge;
