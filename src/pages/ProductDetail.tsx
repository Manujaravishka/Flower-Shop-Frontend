import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import { giftApi } from "@/lib/api";
import { env } from "@/lib/env";
import { toast } from "sonner";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import GlassCard from "@/components/luxury/GlassCard";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await giftApi.getById(id as string);
        const found = (data && (data.data ?? data)) ?? null;
        setProduct(found);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const resolveImageUrl = (url: string) => {
    if (!url || url.startsWith("http")) return url;
    return `${env.apiBaseUrl.replace("/api/v1", "")}${url}`;
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        colour: product.colour,
        size: product.size,
        category: product.category,
        imageUrl: resolveImageUrl(product.mediaUrl?.[0]?.url ?? ""),
      });
    }
    setIsAdded(true);
    toast.success(`${product.name} added to bag`);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const features = [
    { icon: Truck, text: "Complimentary same-day delivery" },
    { icon: ShieldCheck, text: "Seven-day bloom guarantee" },
    { icon: RotateCcw, text: "Effortless returns within 24h" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ClientNavbar />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-6 flex items-center justify-center">
            <LuxurySpinner size={48} />
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <ClientNavbar />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-4 lg:px-6 text-center py-20">
            <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground mb-4">
              Not found
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              The piece you are looking for has slipped from the atelier.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
              style={{
                background:
                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Return to collection
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images =
    product.mediaUrl?.length > 0
      ? product.mediaUrl.map((m: any) => resolveImageUrl(m.url))
      : [
          "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&h=900&fit=crop",
        ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />

      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        {/* Hero — gallery + info side-by-side */}
        <section className="relative">
          <GradientOrbs variant="subtle" />
          <div className="container mx-auto px-4 lg:px-6 relative">
            {/* Breadcrumb */}
            <MotionSection>
              <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 sm:mb-10">
                <Link
                  to="/"
                  className="hover:text-primary transition-colors"
                >
                  Home
                </Link>
                <span className="opacity-40">/</span>
                <Link
                  to="/products"
                  className="hover:text-primary transition-colors"
                >
                  Collection
                </Link>
                <span className="opacity-40">/</span>
                <span className="text-foreground/80">{product.name}</span>
              </nav>
            </MotionSection>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* Gallery */}
              <div className="lg:col-span-7">
                <MotionSection>
                  <div
                    className="relative aspect-[4/5] sm:aspect-[5/6] rounded-3xl overflow-hidden bg-white border border-cream-200/80 shadow-elevated"
                    style={{
                      boxShadow:
                        "0 30px 80px -28px rgba(74, 29, 107, 0.28), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    {!imgLoaded && (
                      <div className="absolute inset-0 bg-gradient-to-br from-cream-100 to-cream-200 animate-pulse" />
                    )}
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImage}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        onLoad={() => setImgLoaded(true)}
                        src={images[currentImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Soft cream vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-cream/15 via-transparent to-transparent pointer-events-none" />

                    {/* Top hairline */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

                    {/* Image navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setCurrentImage((prev) =>
                              prev === 0 ? images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-cream-200 flex items-center justify-center text-foreground hover:bg-white hover:border-primary/30 transition-all shadow-soft"
                        >
                          <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() =>
                            setCurrentImage((prev) =>
                              prev === images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-cream-200 flex items-center justify-center text-foreground hover:bg-white hover:border-primary/30 transition-all shadow-soft"
                        >
                          <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      </>
                    )}

                    {/* Like + share */}
                    <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={cn(
                          "w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all shadow-soft",
                          isLiked
                            ? "bg-rose text-primary-foreground border-rose"
                            : "bg-white/90 border-cream-200 text-foreground/75 hover:bg-white hover:text-primary hover:border-primary/30"
                        )}
                      >
                        <Heart
                          className={cn("w-4 h-4", isLiked && "fill-current")}
                          strokeWidth={1.8}
                        />
                      </button>
                      <button className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md bg-white/90 border border-cream-200 text-foreground/75 hover:bg-white hover:text-primary hover:border-primary/30 transition-all shadow-soft">
                        <Share2 className="w-4 h-4" strokeWidth={1.8} />
                      </button>
                    </div>

                    {/* Image count */}
                    {images.length > 1 && (
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-cream-200 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/80 shadow-soft">
                        <span>{String(currentImage + 1).padStart(2, "0")}</span>
                        <span className="opacity-30">/</span>
                        <span className="opacity-60">
                          {String(images.length).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                      {images.map((img: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={cn(
                            "relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 shadow-soft",
                            currentImage === index
                              ? "border-primary"
                              : "border-white opacity-70 hover:opacity-100"
                          )}
                        >
                          <img
                            src={img}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </MotionSection>
              </div>

              {/* Info */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <MotionSection delay={0.1}>
                  <div className="space-y-7">
                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {product.category.map((cat: string) => (
                          <span
                            key={cat}
                            className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] bg-white/80 border border-cream-200 text-foreground/80"
                          >
                            {cat}
                          </span>
                        ))}
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground shadow-soft"
                          style={{
                            background:
                              "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                          }}
                        >
                          {product.size}
                        </span>
                      </div>

                      <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] text-balance">
                        {product.name}
                      </h1>
                      <p className="mt-3 text-sm text-muted-foreground">
                        {product.colour}
                        <span className="mx-2 opacity-30">·</span>
                        Composition No.{" "}
                        {product._id?.slice(-4).toUpperCase()}
                      </p>
                    </div>

                    <div className="luxury-divider" />

                    <div className="flex items-baseline gap-3">
                      <p className="font-display text-4xl sm:text-5xl font-medium text-primary tracking-tight">
                        <span className="text-base text-muted-foreground font-normal mr-1">
                          Rs.
                        </span>
                        {product.price.toLocaleString()}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        · Inc. complimentary wrapping
                      </span>
                    </div>

                    {product.description &&
                      product.description !== '""' && (
                        <p className="text-muted-foreground leading-relaxed text-pretty">
                          {product.description}
                        </p>
                      )}

                    {/* Quantity + Add */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1 p-1 rounded-full bg-white/80 border border-cream-200 shadow-soft">
                        <button
                          onClick={() =>
                            setQuantity(Math.max(1, quantity - 1))
                          }
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/[0.06] text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" strokeWidth={2} />
                        </button>
                        <span className="w-10 text-center font-display text-base font-medium text-foreground">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-primary/[0.06] text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddToCart}
                        className={cn(
                          "flex-1 min-w-[200px] h-12 px-7 rounded-full text-sm font-medium flex items-center justify-center gap-2 transition-all text-primary-foreground shadow-soft",
                          isAdded
                            ? "bg-primary"
                            : "hover:shadow-glow"
                        )}
                        style={
                          !isAdded
                            ? {
                                background:
                                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                              }
                            : undefined
                        }
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" strokeWidth={2.4} />
                            Added to bag
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                            Add to bag · Rs.{" "}
                            {(product.price * quantity).toLocaleString()}
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Features */}
                    <GlassCard className="p-5" variant="default">
                      <div className="space-y-4">
                        {features.map((feature, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3.5 last:pb-0"
                          >
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-soft"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(74, 29, 107, 0.1), rgba(244, 194, 194, 0.18))",
                                border: "1px solid rgba(74, 29, 107, 0.15)",
                              }}
                            >
                              <feature.icon
                                className="w-4 h-4 text-primary"
                                strokeWidth={1.8}
                              />
                            </div>
                            <span className="text-sm text-foreground/90">
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>

                    {/* Atelier badge */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Sparkles
                        className="w-3 h-3 text-gold"
                        strokeWidth={2}
                      />
                      Each piece is hand-tied to order by a master florist
                    </div>
                  </div>
                </MotionSection>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-cream/30 to-transparent">
        <div className="container mx-auto px-4 lg:px-6">
          <ReviewSection giftId={id as string} />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
