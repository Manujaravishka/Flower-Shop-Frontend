import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Check, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  imageUrl?: string;
  onClick?: () => void;
}

const ProductCard = ({
  _id,
  name,
  price,
  colour,
  size,
  category,
  imageUrl,
  onClick,
}: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ _id, name, price, colour, size, category, imageUrl });
    setIsAdded(true);
    toast.success(`${name} added to bag`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="group relative h-full"
    >
      <div onClick={onClick} className="block h-full cursor-pointer">
        <div
          className="relative h-full rounded-3xl overflow-hidden flex flex-col bg-white border border-cream-200/70 transition-all duration-500 group-hover:shadow-elevated group-hover:border-cream-200"
          style={{
            boxShadow:
              "inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 14px 40px -22px rgba(27, 67, 50, 0.14)",
          }}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-20 pointer-events-none" />

          <div className="relative aspect-square overflow-hidden bg-cream-100">
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-cream-100 to-cream-200 animate-pulse" />
            )}
            {imageUrl ? (
              <motion.img
                src={imageUrl}
                alt={name}
                onLoad={() => setImgLoaded(true)}
                className="w-full h-full object-cover"
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{
                  scale: imgLoaded ? 1 : 1.06,
                  opacity: imgLoaded ? 1 : 0,
                }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #F4C2C2 0%, #C8A24A 100%)",
                }}
              >
                <span className="text-5xl opacity-60">🌸</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-cream/70 via-cream/0 to-transparent" />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, transparent 30%, rgba(200, 162, 74, 0.18) 60%, transparent 100%)",
              }}
            />

            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <div
                className="px-2.5 py-1 rounded-full text-[9px] font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-soft"
                style={{
                  background:
                    "linear-gradient(135deg, #C8A24A 0%, #E0C075 100%)",
                }}
              >
                <Sparkles className="w-2.5 h-2.5 inline-block mr-1 -mt-0.5" />
                In Stock
              </div>
            </div>

            <button
              onClick={handleLike}
              className={cn(
                "absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border shadow-soft",
                isLiked
                  ? "bg-rose text-primary-foreground border-rose"
                  : "bg-white/85 border-cream-200 text-foreground/70 hover:bg-white hover:text-primary hover:border-primary/30"
              )}
            >
              <Heart
                className={cn("w-4 h-4", isLiked && "fill-current")}
                strokeWidth={2}
              />
            </button>

            <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="flex-1 h-10 rounded-full bg-white/95 border border-cream-200 text-foreground text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-white hover:border-primary/30 transition-all shadow-soft"
              >
                <Eye className="w-3.5 h-3.5" strokeWidth={1.8} />
                View
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className={cn(
                  "flex-1 h-10 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all text-primary-foreground shadow-soft",
                  isAdded ? "bg-primary" : "hover:shadow-glow"
                )}
                style={
                  !isAdded
                    ? {
                        background:
                          "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                      }
                    : undefined
                }
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" strokeWidth={2.4} />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
                    Add
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="p-5 flex flex-col flex-1 bg-white">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {category.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-[0.18em] bg-cream-100 text-muted-foreground border border-cream-200"
                >
                  {cat}
                </span>
              ))}
              <span
                className="px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-[0.18em] text-primary border border-primary/25"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(27, 67, 50, 0.08), rgba(27, 67, 50, 0.02))",
                }}
              >
                {size}
              </span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-medium text-foreground leading-tight line-clamp-1 transition-colors duration-500 group-hover:text-primary">
              {name}
            </h3>
            <div className="mt-auto pt-3 flex items-end justify-between">
              <p className="text-xs text-muted-foreground">{colour}</p>
              <p className="font-display text-base sm:text-lg font-semibold text-primary tracking-tight">
                <span className="text-xs text-muted-foreground/80 font-normal mr-0.5">
                  Rs.
                </span>
                {price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
