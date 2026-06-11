import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/lib/api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flower2,
  Truck,
  Sparkles,
  ArrowRight,
  Wand2,
  Star,
  Zap,
  Palette,
  Award,
  Leaf,
  Quote,
  ArrowUpRight,
  Check,
  Globe,
  Heart,
} from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import ProductCardEnhanced from "@/components/ProductCardEnhanced";
import CategoryCard from "@/components/CategoryCard";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import StaggerContainer, {
  StaggerItem,
} from "@/components/luxury/StaggerContainer";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { giftApi } from "@/lib/api";
import { cn } from "@/lib/utils";

const Index = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await giftApi.getAll();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const newDrops = products.slice(0, 4);
  const bestSellers = products.slice(0, 4);

  const categories = [
    {
      name: "Bouquets",
      description: "Hand-tied arrangements for every milestone",
      imageUrl:
        "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&h=1100&fit=crop",
      count: 25,
      slug: "bouquets",
    },
    {
      name: "Pots",
      description: "Living plants curated for modern spaces",
      imageUrl:
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&h=1100&fit=crop",
      count: 18,
      slug: "pot",
    },
    {
      name: "Atelier",
      description: "Bespoke compositions designed by you and our florists",
      imageUrl:
        "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=900&h=1100&fit=crop",
      count: 12,
      slug: "custom",
    },
  ];

  const features = [
    {
      icon: Flower2,
      title: "Hand-tied",
      description: "Composed by master florists, never mass-produced",
    },
    {
      icon: Truck,
      title: "Same-day delivery",
      description: "Across Colombo and surrounds, in climate-controlled vans",
    },
    {
      icon: Wand2,
      title: "AI atelier",
      description: "Co-create your arrangement with intelligent tools",
    },
    {
      icon: Award,
      title: "Guaranteed bloom",
      description: "Seven-day freshness promise on every stem",
    },
  ];

  const stats = [
    { value: "500+", label: "Compositions" },
    { value: "10K+", label: "Happy clients" },
    { value: "4.9", label: "Rating", icon: Star },
    { value: "12", label: "Years" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 pb-16">
        <GradientOrbs variant="hero" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left content */}
            <div className="lg:col-span-7 xl:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-cream-200 shadow-soft mb-7"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/85">
                  Spring Collection · 2026
                </span>
              </motion.div>

              <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-medium text-foreground leading-[0.96] tracking-[-0.025em] text-balance">
                <span className="block overflow-hidden">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    Flowers, considered.
                  </motion.span>
                </span>
                <span className="block overflow-hidden mt-1">
                  <motion.span
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="block italic font-serif gradient-text-gold"
                  >
                    Arrangements, told.
                  </motion.span>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-7 text-base sm:text-lg text-muted-foreground max-w-xl text-pretty leading-relaxed"
              >
                An atelier of floristry crafting seasonal, hand-tied compositions
                for the modern home. From the in-bloom to the imagined — delivered
                with discretion and grace.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65 }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Link
                  to="/products"
                  className="group inline-flex items-center gap-2 h-14 px-7 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                  }}
                >
                  Shop the collection
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  to="/customize"
                  className="group inline-flex items-center gap-2 h-14 px-7 rounded-full bg-white/85 border border-cream-200 text-foreground hover:bg-white hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-soft transition-all duration-300 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 text-gold" strokeWidth={2} />
                  Design with AI
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.85 }}
                className="mt-14 pt-8 border-t border-cream-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4"
              >
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 + i * 0.08 }}
                  >
                    <p className="font-display text-2xl sm:text-3xl font-medium text-foreground flex items-center gap-1.5 tracking-tight">
                      {stat.value}
                      {stat.icon && (
                        <stat.icon
                          className="w-4 h-4 sm:w-5 sm:h-5 text-gold fill-gold"
                          strokeWidth={1.5}
                        />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 tracking-wide">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right hero visual */}
            <div className="lg:col-span-5 xl:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[3/4] max-w-md mx-auto lg:max-w-none"
              >
                {/* Decorative frame */}
                <div
                  className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-60"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(244, 194, 194, 0.5), rgba(200, 162, 74, 0.35))",
                  }}
                />

                {/* Main image */}
                <div
                  className="relative h-full w-full rounded-[2rem] overflow-hidden border border-white/80 shadow-elevated"
                  style={{
                    boxShadow:
                      "0 40px 90px -30px rgba(74, 29, 107, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=900&h=1200&fit=crop"
                    alt="Featured floral arrangement"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cream/60 via-transparent to-transparent" />

                  {/* Floating preview card top */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.8 }}
                    className="absolute top-5 left-5 right-5 flex items-center gap-3 px-4 py-3 rounded-2xl glass-strong shadow-soft"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft"
                      style={{
                        background:
                          "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                      }}
                    >
                      <Sparkles
                        className="w-4 h-4 text-primary-foreground"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">
                        Atelier AI Preview
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Rose · Peony · Eucalyptus
                      </p>
                    </div>
                  </motion.div>

                  {/* Floating card bottom */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                    className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-strong shadow-soft"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          Featured
                        </p>
                        <p className="font-display text-base font-medium text-foreground mt-0.5">
                          Aurora Bloom
                        </p>
                      </div>
                      <p className="font-display text-lg font-semibold gradient-text-gold">
                        Rs. 6,200
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Secondary floating image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-6 -left-6 sm:-left-12 w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-white shadow-elevated hidden sm:block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400&h=400&fit=crop"
                    alt="Succulent"
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Tertiary floating element */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -top-4 -right-4 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-elevated hidden sm:block"
                >
                  <img
                    src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&h=400&fit=crop"
                    alt="Sunflower"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* FEATURES BAR */}
      <section className="relative py-8 sm:py-10 border-y border-cream-200/80 bg-white/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <StaggerContainer
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            staggerChildren={0.08}
          >
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className="group flex items-center gap-4 p-3 sm:p-4 rounded-2xl hover:bg-white/70 transition-colors">
                  <div
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-white border border-cream-200 shadow-soft group-hover:border-primary/30 group-hover:shadow-glow transition-all"
                  >
                    <feature.icon
                      className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                      strokeWidth={1.6}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm sm:text-base font-medium text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 hidden sm:block">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* NEW DROPS */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
            <MotionSection>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  <Zap className="w-3 h-3 inline-block -mt-0.5 mr-1.5" strokeWidth={2} />
                  Just Arrived
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-tight">
                New <span className="italic font-serif gradient-text-gold">Drops</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty max-w-lg">
                Fresh from the atelier — limited compositions for the season.
              </p>
            </MotionSection>
            <MotionSection delay={0.1}>
              <Link
                to="/products?filter=new"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white/85 border border-cream-200 text-sm font-medium text-foreground hover:bg-white hover:border-primary/30 hover:shadow-soft transition-all"
              >
                View all
                <ArrowUpRight
                  className="w-4 h-4 group-hover:rotate-45 transition-transform"
                  strokeWidth={2}
                />
              </Link>
            </MotionSection>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <LuxurySpinner size={40} />
            </div>
          ) : (
            <StaggerContainer
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
              staggerChildren={0.1}
            >
              {(newDrops.length > 0
                ? newDrops
                : [...Array(4)].map((_, i) => ({
                    _id: `placeholder-${i}`,
                    name: ["Rose Garden", "Lavender Dreams", "Sunflower Bliss", "Succulent Joy"][i],
                    price: [2500, 1800, 3200, 1500][i],
                    colour: ["Pink", "Purple", "Yellow", "Green"][i],
                    size: "MEDIUM",
                    category: [["BOUQUETS"], ["POT"], ["BOUQUETS"], ["POT"]][i],
                    mediaUrl: [],
                  }))
              ).map((product: any) => (
                <StaggerItem key={product._id}>
                  <ProductCardEnhanced
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={
                      product.mediaUrl?.[0]?.url
                        ? product.mediaUrl[0].url.startsWith("http")
                          ? product.mediaUrl[0].url
                          : `http://localhost:3000${product.mediaUrl[0].url}`
                        : "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=750&fit=crop"
                    }
                    isNew
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative py-20 sm:py-28">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(244, 194, 194, 0.12) 50%, transparent 100%)",
          }}
        />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="text-center mb-14 sm:mb-20">
            <MotionSection className="flex justify-center">
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  <Palette className="w-3 h-3 inline-block -mt-0.5 mr-1.5" strokeWidth={2} />
                  Collections
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
            </MotionSection>
            <MotionSection delay={0.05}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-tight">
                Curated <span className="italic font-serif gradient-text-gold">worlds</span>
              </h2>
            </MotionSection>
            <MotionSection delay={0.1}>
              <p className="mt-5 text-muted-foreground max-w-2xl mx-auto text-pretty">
                Three considered collections — each a study in mood, season and
                material.
              </p>
            </MotionSection>
          </div>

          <StaggerContainer
            className="grid md:grid-cols-3 gap-5 sm:gap-6"
            staggerChildren={0.15}
          >
            {categories.map((category) => (
              <StaggerItem key={category.slug}>
                <CategoryCard {...category} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
            <MotionSection>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  <Star className="w-3 h-3 inline-block -mt-0.5 mr-1.5 fill-current" strokeWidth={1.5} />
                  Most Loved
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-tight">
                Client <span className="italic font-serif gradient-text-gold">favourites</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty max-w-lg">
                The pieces our clients return to, season after season.
              </p>
            </MotionSection>
            <MotionSection delay={0.1}>
              <Link
                to="/products?filter=bestseller"
                className="group inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white/85 border border-cream-200 text-sm font-medium text-foreground hover:bg-white hover:border-primary/30 hover:shadow-soft transition-all"
              >
                View all
                <ArrowUpRight
                  className="w-4 h-4 group-hover:rotate-45 transition-transform"
                  strokeWidth={2}
                />
              </Link>
            </MotionSection>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <LuxurySpinner size={40} />
            </div>
          ) : (
            <StaggerContainer
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
              staggerChildren={0.1}
            >
              {(bestSellers.length > 0
                ? bestSellers
                : [...Array(4)].map((_, i) => ({
                    _id: `bestseller-${i}`,
                    name: ["Classic Rose", "Tropical Mix", "Zen Garden", "Spring Bouquet"][i],
                    price: [3500, 2800, 2200, 4500][i],
                    colour: ["Red", "Mixed", "Green", "Mixed"][i],
                    size: "LARGE",
                    category: [["BOUQUETS"], ["BOUQUETS"], ["POT"], ["BOUQUETS"]][i],
                    mediaUrl: [],
                  }))
              ).map((product: any) => (
                <StaggerItem key={product._id}>
                  <ProductCardEnhanced
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={
                      product.mediaUrl?.[0]?.url ||
                      "https://images.unsplash.com/photo-1518882605630-8eb256a2c4c7?w=600&h=750&fit=crop"
                    }
                    isBestSeller
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <GradientOrbs variant="subtle" />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <MotionSection>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  The Word
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
              <Quote
                className="w-12 h-12 text-gold/70 mx-auto mb-6"
                strokeWidth={1.5}
              />
              <blockquote className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground leading-[1.2] tracking-tight text-balance">
                "The composition arrived like a small piece of modern art. Every
                stem considered, every detail intentional. A truly{" "}
                <span className="italic font-serif gradient-text-gold">unforgettable</span>{" "}
                experience."
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold shadow-soft"
                  style={{
                    background:
                      "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                  }}
                >
                  SL
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Selina Lawrence</p>
                  <p className="text-xs text-muted-foreground">Colombo · Returning client</p>
                </div>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>

      {/* ATELIER CTA */}
      <section className="relative py-20 sm:py-28">
        <div className="container mx-auto px-4 lg:px-6">
          <MotionSection>
            <div
              className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden bg-white border border-cream-200/80 shadow-elevated"
            >
              <div className="absolute inset-0 opacity-70">
                <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-rose/30 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-gold/20 blur-3xl" />
              </div>
              <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center p-8 sm:p-12 lg:p-20">
                <div>
                  <div className="inline-flex items-center gap-2 mb-6">
                    <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                      The Atelier
                    </span>
                    <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-tight text-balance">
                    Compose something{" "}
                    <span className="italic font-serif gradient-text-gold">unrepeatable</span>
                  </h2>
                  <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-md text-pretty leading-relaxed">
                    Our AI co-designer helps you shape the arrangement in your mind —
                    then our florists bring it to life, stem by stem.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/customize"
                      className="group inline-flex items-center gap-2 h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                      }}
                    >
                      <Wand2 className="w-4 h-4" strokeWidth={2} />
                      Start creating
                      <ArrowRight
                        className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                        strokeWidth={2}
                      />
                    </Link>
                    <Link
                      to="/gallery"
                      className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white border border-cream-200 text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all text-sm font-medium"
                    >
                      View gallery
                    </Link>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-2">
                    {["AI preview", "Hand-finished", "Same-day delivery", "Gift-wrapped"].map(
                      (f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-foreground/80 bg-white/80 border border-cream-200"
                        >
                          <Check className="w-3 h-3 text-primary" strokeWidth={2.5} />
                          {f}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="relative aspect-square max-w-md mx-auto w-full">
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden border-4 border-white shadow-elevated"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=900&h=900&fit=crop"
                      alt="AI design preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/15 to-transparent" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="absolute -bottom-4 -left-4 sm:-left-8 p-4 rounded-2xl glass-strong shadow-elevated"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft"
                        style={{
                          background:
                            "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                        }}
                      >
                        <Sparkles
                          className="w-4 h-4 text-primary-foreground"
                          strokeWidth={2}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">
                          Composition ready
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Hand-tied within 24h
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </MotionSection>
        </div>
      </section>

      {/* BRAND PROMISE STRIP */}
      <section className="relative py-12 sm:py-16 border-y border-cream-200/80 bg-white/40">
        <div className="container mx-auto px-4 lg:px-6">
          <StaggerContainer
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10"
            staggerChildren={0.1}
          >
            {[
              { icon: Leaf, label: "Sustainably sourced" },
              { icon: Heart, label: "Composed with love" },
              { icon: Globe, label: "Worldwide delivery" },
              { icon: Award, label: "Master florists" },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white border border-cream-200 shadow-soft"
                  >
                    <item.icon
                      className="w-5 h-5 text-primary"
                      strokeWidth={1.6}
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
