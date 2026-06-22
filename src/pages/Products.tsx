import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { giftApi } from "@/lib/api";
import { normalizeCategoryString } from "@/lib/category";
import { filterProducts } from "@/lib/filters";
import type { Product, FilterState, SortOption } from "@/lib/filters";
import { env } from "@/lib/env";

import {
  Search,
  X,
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  ArrowUpDown,
} from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import StaggerContainer, {
  StaggerItem,
} from "@/components/luxury/StaggerContainer";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";

const categories = ["POT", "BOQUETS"];
const sizes = ["SMALL", "MEDIUM", "LARGE"];
const sortOptions = [
  { id: "featured" as const, label: "Featured" },
  { id: "price-asc" as const, label: "Price: Low to High" },
  { id: "price-desc" as const, label: "Price: High to Low" },
  { id: "name" as const, label: "Name" },
];

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    () => searchParams.get("q") ?? ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => {
      const filter = searchParams.get("filter");
      if (!filter) return null;
      const normalized = normalizeCategoryString(filter);
      return categories.includes(normalized) ? normalized : null;
    }
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    const size = searchParams.get("size");
    return size ? size.toUpperCase() : null;
  });
  const [sortBy, setSortBy] = useState<SortOption>(
    () => (searchParams.get("sort") as SortOption) ?? "featured"
  );
  const [view, setView] = useState<"grid" | "large">("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    fetchProducts(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const fetchProducts = async (signal?: AbortSignal) => {
    try {
      const data = await giftApi.getAll({ category: "POT,BOQUETS" }, signal);
      if (!signal?.aborted) {
        setAllProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Failed to fetch products:", error);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  };

  const ignoreUrlSync = useRef(false);

  const applyParams = useCallback((params: URLSearchParams) => {
    const urlSearchTerm = params.get("q") ?? "";
    const urlFilter = params.get("filter");
    const urlSize = params.get("size");
    const urlSort = params.get("sort");

    const normalizedUrlCategory = urlFilter
      ? normalizeCategoryString(urlFilter)
      : null;
    const urlSelectedCategory =
      normalizedUrlCategory && categories.includes(normalizedUrlCategory)
        ? normalizedUrlCategory
        : null;
    const urlSelectedSize = urlSize ? urlSize.toUpperCase() : null;
    const urlSortBy = (urlSort as SortOption) ?? "featured";

    setSearchTerm(urlSearchTerm);
    setSelectedCategory(urlSelectedCategory);
    setSelectedSize(urlSelectedSize);
    setSortBy(urlSortBy);
  }, []);

  useEffect(() => {
    applyParams(searchParams);
  }, []);

  useEffect(() => {
    if (ignoreUrlSync.current) {
      ignoreUrlSync.current = false;
      return;
    }
    applyParams(searchParams);
  }, [searchParams]);

  const syncToUrl = useCallback(
    (updates: Partial<FilterState>) => {
      ignoreUrlSync.current = true;
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.searchTerm !== undefined) {
            if (updates.searchTerm) next.set("q", updates.searchTerm);
            else next.delete("q");
          }
          if (updates.selectedCategory !== undefined) {
            if (updates.selectedCategory) next.set("filter", updates.selectedCategory.toLowerCase());
            else next.delete("filter");
          }
          if (updates.selectedSize !== undefined) {
            if (updates.selectedSize) next.set("size", updates.selectedSize.toLowerCase());
            else next.delete("size");
          }
          if (updates.sortBy !== undefined) {
            if (updates.sortBy && updates.sortBy !== "featured") next.set("sort", updates.sortBy);
            else next.delete("sort");
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleCategoryClick = useCallback(
    (cat: string) => {
      const next = selectedCategory === cat ? null : cat;
      setSelectedCategory(next);
      syncToUrl({ selectedCategory: next });
    },
    [syncToUrl, selectedCategory]
  );

  const handleSizeClick = useCallback(
    (size: string) => {
      const next = selectedSize === size ? null : size;
      setSelectedSize(next);
      syncToUrl({ selectedSize: next });
    },
    [syncToUrl, selectedSize]
  );

  const handleSortChange = useCallback(
    (id: SortOption) => {
      setSortBy(id);
      syncToUrl({ sortBy: id });
      setSortOpen(false);
    },
    [syncToUrl]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      syncToUrl({ searchTerm: value });
    },
    [syncToUrl]
  );

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSize(null);
    setSortBy("featured");
    ignoreUrlSync.current = true;
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const hasActiveFilters = searchTerm || selectedCategory || selectedSize || sortBy !== "featured";

  const filteredProducts = useMemo(
    () =>
      filterProducts(allProducts, {
        searchTerm,
        selectedCategory,
        selectedSize,
        sortBy,
      }),
    [allProducts, searchTerm, selectedCategory, selectedSize, sortBy]
  );

  const getImageUrl = useCallback((product: Product): string | undefined => {
    const url = product.mediaUrl?.[0]?.url;
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    return `${env.apiBaseUrl.replace("/api/v1", "")}${url}`;
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />

      <section className="relative pt-32 sm:pt-40 pb-12 sm:pb-16 overflow-hidden">
        <GradientOrbs variant="subtle" />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <MotionSection>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
              <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                The Collection
              </span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[0.96] tracking-[-0.025em] text-balance max-w-4xl">
              Every bloom, <span className="italic font-serif gradient-text-gold">composed</span>.
            </h1>
            <p className="mt-5 text-muted-foreground max-w-xl text-pretty text-lg">
              Browse our full atelier of floral arrangements, hand-tied to order.
            </p>
          </MotionSection>
        </div>
      </section>

      <div className="sticky top-20 z-30 bg-white/85 backdrop-blur-xl border-y border-border/80 shadow-soft">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3 flex-1 w-full sm:max-w-md">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  strokeWidth={1.8}
                />
                <input
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by name or colour"
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-white/80 border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-cream-100 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "h-9 px-4 rounded-full text-xs font-medium uppercase tracking-[0.15em] transition-all border",
                    selectedCategory === cat
                      ? "text-primary-foreground border-transparent shadow-soft"
                      : "bg-white/70 border-cream-200 text-foreground/70 hover:text-primary hover:border-primary/30"
                  )}
                  style={
                    selectedCategory === cat
                      ? {
                          background:
                            "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                        }
                      : undefined
                  }
                >
                  {cat === "BOQUETS" ? "Bouquets" : cat === "GIFTBOX" ? "Gift Boxes" : cat.charAt(0) + cat.slice(1).toLowerCase()}
                </motion.button>
              ))}

              <div className="h-5 w-px bg-cream-200 mx-1 hidden sm:block" />

              {sizes.map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSizeClick(size)}
                  className={cn(
                    "h-9 px-3.5 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] transition-all border",
                    selectedSize === size
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-transparent border-cream-200 text-foreground/70 hover:text-primary hover:border-primary/30"
                  )}
                >
                  {size.charAt(0) + size.slice(1).toLowerCase()}
                </motion.button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="h-9 px-3 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-rose-deep transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}

              <div className="h-5 w-px bg-cream-200 mx-1 hidden sm:block" />

              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="h-9 px-3.5 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/70 hover:text-primary border border-cream-200 hover:border-primary/30 flex items-center gap-1.5 bg-white/70"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  {sortOptions.find((o) => o.id === sortBy)?.label}
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setSortOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-56 z-50 bg-white/95 backdrop-blur-xl border border-cream-200 rounded-2xl p-2 shadow-elevated"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleSortChange(opt.id)}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-xl text-sm transition-colors",
                              sortBy === opt.id
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-foreground/80 hover:text-primary hover:bg-cream-100"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-5 w-px bg-cream-200 mx-1 hidden sm:block" />

              <div className="hidden sm:flex items-center p-0.5 rounded-full border border-cream-200 bg-white/70">
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    view === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                  )}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => setView("large")}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    view === "large"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-primary"
                  )}
                  aria-label="Large view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="py-12 sm:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="text-foreground font-medium">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LuxurySpinner size={40} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <MotionSection className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-white border border-cream-200 shadow-soft flex items-center justify-center mb-6">
                <SlidersHorizontal
                  className="w-6 h-6 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-display text-2xl font-medium text-foreground">
                No matches
              </h3>
              <p className="mt-2 text-muted-foreground text-pretty max-w-sm mx-auto">
                {allProducts.length === 0
                  ? "Our atelier is being prepared. Please return shortly."
                  : "Try a different search or clear your filters."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-6 inline-flex items-center gap-2 h-11 px-5 rounded-full bg-white border border-cream-200 text-sm font-medium text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all"
                >
                  Clear filters
                </button>
              )}
            </MotionSection>
          ) : (
            <StaggerContainer
              staggerKey={`${selectedCategory}-${selectedSize}-${sortBy}-${searchTerm}`}
              className={cn(
                "grid gap-5 sm:gap-6",
                view === "grid"
                  ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              )}
              staggerChildren={0.06}
            >
              {filteredProducts.map((product) => (
                <StaggerItem key={product._id}>
                  <ProductCard
                    _id={product._id}
                    name={product.name}
                    price={product.price}
                    colour={product.colour}
                    size={product.size}
                    category={product.category}
                    imageUrl={getImageUrl(product)}
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
