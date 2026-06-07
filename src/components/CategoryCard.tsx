import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  description: string;
  imageUrl: string;
  count: number;
  slug: string;
}

const CategoryCard = ({
  name,
  description,
  imageUrl,
  count,
  slug,
}: CategoryCardProps) => {
  return (
    <Link
      to={`/categories?filter=${slug}`}
      className="group relative overflow-hidden rounded-3xl aspect-[3/4] block"
      style={{
        boxShadow:
          "0 24px 60px -28px rgba(27, 67, 50, 0.28), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)",
      }}
    >
      <div className="absolute inset-0">
        <motion.img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Layered cream gradient overlays for legibility on light theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-cream/50 via-transparent to-rose/15 opacity-90" />
      </div>

      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />

      {/* Decorative orb */}
      <div
        className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000"
        style={{
          background:
            "radial-gradient(circle, rgba(200, 162, 74, 0.55) 0%, transparent 70%)",
        }}
      />

      {/* Floating index label */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/70 shadow-soft">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, #1B4332 0%, #C8A24A 100%)",
          }}
        />
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/85">
          {count} pieces
        </span>
      </div>

      {/* Arrow top right */}
      <div className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md border border-white/70 flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-soft">
        <ArrowUpRight
          className="w-4 h-4 text-primary"
          strokeWidth={1.8}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-end z-10">
        <motion.div
          initial={{ y: 8 }}
          whileHover={{ y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground leading-[1.05] tracking-tight">
            {name}
          </h3>
          <p className="mt-2 text-sm text-foreground/70 max-w-xs text-pretty line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {description}
          </p>
          <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
            <span>Explore</span>
            <span className="w-0 group-hover:w-6 h-px bg-primary transition-all duration-500" />
          </div>
        </motion.div>
      </div>

      {/* Hover border */}
      <div className="absolute inset-0 rounded-3xl border border-white/40 group-hover:border-white/80 transition-colors duration-500 z-10 pointer-events-none" />
    </Link>
  );
};

export default CategoryCard;
