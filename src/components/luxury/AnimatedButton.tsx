import { motion } from "framer-motion";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "gold";
type Size = "sm" | "md" | "lg" | "xl";

interface AnimatedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "ref"> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
  fullWidth?: boolean;
  href?: string;
}

const baseStyles =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-full overflow-hidden transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:shadow-glow hover:-translate-y-0.5 hover:bg-[#4A1D6B]",
  gold:
    "text-primary shadow-soft hover:shadow-glow-gold hover:-translate-y-0.5",
  secondary:
    "bg-white/80 text-foreground border border-cream-200 hover:bg-white hover:border-primary/30 hover:-translate-y-0.5",
  ghost:
    "text-foreground/80 hover:text-foreground hover:bg-cream-100",
  outline:
    "border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
  xl: "h-14 px-8 text-base",
};

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconRight,
      className = "",
      fullWidth = false,
      ...rest
    },
    ref
  ) => {
    const goldBg = {
      background:
        "linear-gradient(135deg, #C8A24A 0%, #E0C075 50%, #C8A24A 100%)",
    };
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: variant === "primary" || variant === "gold" || variant === "outline" ? -2 : 0 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        style={variant === "gold" ? goldBg : undefined}
        {...(rest as any)}
      >
        {/* Shimmer effect for primary & gold */}
        {(variant === "primary" || variant === "gold") && (
          <motion.span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={false}
            whileHover={{ x: "200%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            aria-hidden="true"
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {icon}
          {children}
          {iconRight}
        </span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export default AnimatedButton;
