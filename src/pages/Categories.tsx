import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { giftApi } from "@/lib/api";
import { normalizeCategoryString, normalizeCategories } from "@/lib/category";
import { env } from "@/lib/env";
import { Grid3X3, LayoutGrid, Sparkles, ArrowUpRight } from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import ProductCardEnhanced from "@/components/ProductCardEnhanced";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import StaggerContainer, {
  StaggerItem,
} from "@/components/luxury/StaggerContainer";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  { id: "all", label: "Everything" },
  { id: "bouquets", label: "Bouquets" },
  { id: "pot", label: "Pots" },
  { id: "flowers", label: "Flowers" },
  { id: "keytag", label: "Keytags" },
  { id: "giftbox", label: "Gift boxes" },
  { id: "custom", label: "Bespoke" },
] as const;

const Categories = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "large">("grid");
  const ignoreUrlSync = useRef(false);
  const initialMount = useRef(true);

  const [activeFilter, setActiveFilter] = useState<string>(
    () => searchParams.get("filter")?.toLowerCase() ?? "all"
  );

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await giftApi.getAll(undefined, controller.signal);
        if (!controller.signal.aborted && Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Error fetching products:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (ignoreUrlSync.current) {
      ignoreUrlSync.current = false;
      return;
    }
    const urlFilter = searchParams.get("filter")?.toLowerCase() ?? "all";
    if (urlFilter !== activeFilter) {
      setActiveFilter(urlFilter);
    }
  }, [searchParams, activeFilter]);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      return;
    }
    ignoreUrlSync.current = true;
    setSearchParams(
      activeFilter === "all" ? {} : { filter: activeFilter },
      { replace: true }
    );
  }, [activeFilter, setSearchParams]);

  const handleFilterClick = useCallback((id: string) => {
    setActiveFilter(id);
  }, []);

  const categoryMatches = (product: any, expected: string): boolean => {
    const productCats = product.category ? normalizeCategories(product.category) : [];
    const expectedNorm = normalizeCategoryString(expected);
    return expectedNorm ? productCats.includes(expectedNorm) : false;
  };

  const filteredProducts = useMemo(
    () => {
      return activeFilter === "all"
        ? products
        : products.filter((product) => categoryMatches(product, activeFilter));
    },
    [products, activeFilter]
  );

  const getImageUrl = (product: any): string => {
    const url = product.mediaUrl?.[0]?.url;
    if (!url) return "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&h=750&fit=crop";
    if (url.startsWith("http")) return url;
    return `${env.apiBaseUrl.replace("/api/v1", "")}${url}`;
  };

  const categoriesWithCount = useMemo(
    () =>
      CATEGORY_TABS.map((cat) => ({
        ...cat,
        count:
          cat.id === "all"
            ? products.length
            : products.filter((p) => categoryMatches(p, cat.id)).length,
      })),
    [products]
  );

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <section className="relative overflow-hidden">
          <GradientOrbs variant="hero" />
          <div className="container mx-auto px-4 lg:px-6 relative py-16 sm:py-20">
            <div className="max-w-3xl">
              <MotionSection>
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                    <Sparkles
                      className="w-3 h-3 inline-block -mt-0.5 mr-1.5"
                      strokeWidth={2}
                    />
                    The Collection
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[0.96] tracking-[-0.025em] text-balance">
                  Curated{" "}
                  <span className="italic font-serif gradient-text-gold">worlds</span>
                </h1>
                <p className="mt-5 text-muted-foreground max-w-xl text-pretty text-lg">
                  Six considered collections, each a study in season and material.
                </p>
              </MotionSection>
            </div>
          </div>
        </section>

        <div className="sticky top-20 z-30 bg-white/85 backdrop-blur-xl border-y border-border/80 shadow-soft">
          <div className="container mx-auto px-4 lg:px-6">
            <MotionSection>
              <div className="py-4 flex gap-2 overflow-x-auto">
                {categoriesWithCount.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleFilterClick(cat.id)}
                    className={cn(
                      "h-10 px-5 rounded-full text-xs font-medium uppercase tracking-[0.15em] transition-all border flex items-center gap-2 flex-shrink-0 shadow-soft",
                      activeFilter === cat.id
                        ? "text-primary-foreground border-transparent"
                        : "bg-white border-cream-200 text-foreground/70 hover:text-primary hover:border-primary/30"
                    )}
                    style={
                      activeFilter === cat.id
                        ? {
                            background:
                              "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                          }
                        : undefined
                    }
                  >
                    {cat.label}
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                        activeFilter === cat.id
                          ? "bg-foreground/20 text-primary-foreground"
                          : "bg-cream-100 text-muted-foreground"
                      )}
                    >
                      {cat.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </MotionSection>
          </div>
        </div>

        <div className="container mx-auto px-4 lg:px-6 py-8 sm:py-10">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-medium">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
              <span className="opacity-40 mx-2">·</span>
              <span className="text-foreground/80">
                {categoriesWithCount.find((c) => c.id === activeFilter)?.label}
              </span>
            </p>
            <div className="hidden sm:flex items-center p-0.5 rounded-full border border-cream-200 bg-white/80 shadow-soft">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" strokeWidth={1.8} />
              </button>
              <button
                onClick={() => setView("large")}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-colors",
                  view === "large"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary"
                )}
                aria-label="Large view"
              >
                <LayoutGrid className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <LuxurySpinner size={40} />
            </div>
          ) : filteredProducts.length > 0 ? (
            <StaggerContainer
              staggerKey={activeFilter}
              className={cn(
                "grid gap-5 sm:gap-6",
                view === "grid"
                  ? "sm:grid-cols-2 lg:grid-cols-4"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              )}
              staggerChildren={0.06}
            >
              {filteredProducts.map((product) => (
                <StaggerItem key={product._id}>
                  <ProductCardEnhanced
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={getImageUrl(product)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : (
            <MotionSection className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-white border border-cream-200 shadow-soft flex items-center justify-center mb-6">
                <Sparkles
                  className="w-6 h-6 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-display text-2xl font-medium text-foreground">
                Nothing in this world — yet
              </h3>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto text-pretty">
                Our florists are preparing new pieces. Please return to the full
                collection.
              </p>
              <button
                onClick={() => handleFilterClick("all")}
                className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white border border-cream-200 text-sm font-medium text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all group"
              >
                View all
                <ArrowUpRight
                  className="w-4 h-4 group-hover:rotate-45 transition-transform"
                  strokeWidth={2}
                />
              </button>
            </MotionSection>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Categories;
