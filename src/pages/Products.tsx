import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { giftApi } from "@/lib/api";
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

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  colour: string;
  size: string;
  category: string[];
  mediaUrl: { url: string; public_id: string; _id: string }[];
}

const categories = ["POT", "BOQUETS"];
const sizes = ["SMALL", "MEDIUM", "LARGE"];
const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name" },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [view, setView] = useState<"grid" | "large">("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory, selectedSize, sortBy]);

  const fetchProducts = async () => {
    try {
      const data = await giftApi.getAll();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.colour.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category.includes(selectedCategory));
    }

    if (selectedSize) {
      filtered = filtered.filter((p) => p.size === selectedSize);
    }

    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSize(null);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedSize;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />

      {/* Hero */}
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

      {/* Sticky filter bar */}
      <div className="sticky top-20 z-30 bg-cream-50/85 backdrop-blur-xl border-y border-cream-200/80 shadow-soft">
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or colour"
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-white/80 border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-white transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
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
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat ? null : cat)
                  }
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
                            "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                        }
                      : undefined
                  }
                >
                  {cat === "BOQUETS" ? "Bouquets" : "Pots"}
                </motion.button>
              ))}

              <div className="h-5 w-px bg-cream-200 mx-1 hidden sm:block" />

              {sizes.map((size) => (
                <motion.button
                  key={size}
                  whileTap={{ scale: 0.96 }}
                  onClick={() =>
                    setSelectedSize(selectedSize === size ? null : size)
                  }
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

              {/* Sort dropdown */}
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
                            onClick={() => {
                              setSortBy(opt.id);
                              setSortOpen(false);
                            }}
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

              {/* View toggle */}
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

      {/* Results */}
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
                {products.length === 0
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
                    imageUrl={product.mediaUrl?.[0]?.url}
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
