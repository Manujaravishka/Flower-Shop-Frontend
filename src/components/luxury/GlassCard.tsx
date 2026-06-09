import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  variant?: "default" | "strong" | "subtle" | "cream";
  as?: "div" | "article" | "section";
}

const GlassCard = ({
  children,
  className = "",
  style,
  onClick,
  variant = "default",
  as: Tag = "div",
}: GlassCardProps) => {
  const variantClass =
    variant === "strong"
      ? "glass-strong"
      : variant === "subtle"
        ? "bg-white/55 backdrop-blur-xl border border-white/60"
        : variant === "cream"
          ? "glass-cream"
          : "glass-card";

  return (
    <Tag
      onClick={onClick}
      className={cn(
        "rounded-2xl relative overflow-hidden",
        variantClass,
        onClick && "cursor-pointer transition-all duration-500",
        className
      )}
      style={style}
    >
      {/* Subtle inner highlight on top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
      {children}
    </Tag>
  );
};

export default GlassCard;
