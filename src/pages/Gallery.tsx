import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { libraryApi } from "@/lib/api";
import { Search, X, Image as ImageIcon, ArrowUpRight } from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";

interface LibraryItem {
  _id: string;
  title: string;
  mediaUrl: { url: string; public_id: string; _id: string }[];
}

const Gallery = () => {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await libraryApi.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch gallery items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchItems();
      return;
    }

    try {
      const data = await libraryApi.findByName(searchTerm);
      setItems(data.libraries || []);
    } catch (error) {
      console.error("Search failed");
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />

      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <section className="relative">
          <GradientOrbs variant="subtle" />
          <div className="container mx-auto px-4 lg:px-6 relative">
            <div className="max-w-3xl">
              <MotionSection>
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                    Inspiration
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[0.96] tracking-[-0.025em] text-balance">
                  The <span className="italic font-serif gradient-text-gold">gallery</span>
                </h1>
                <p className="mt-5 text-muted-foreground max-w-xl text-pretty text-lg">
                  A library of compositions — find inspiration for your next order.
                </p>
              </MotionSection>
            </div>

            {/* Search */}
            <MotionSection delay={0.1}>
              <div className="mt-12 flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                    strokeWidth={1.8}
                  />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search compositions"
                    className="w-full h-12 pl-11 pr-4 rounded-full bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        fetchItems();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-cream-100 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSearch}
                  className="group h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                  }}
                >
                  Search
                  <ArrowUpRight
                    className="w-4 h-4 group-hover:rotate-45 transition-transform"
                    strokeWidth={2}
                  />
                </motion.button>
              </div>
            </MotionSection>
          </div>
        </section>

        {/* Gallery grid */}
        <div className="container mx-auto px-4 lg:px-6 mt-12 sm:mt-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LuxurySpinner size={40} />
            </div>
          ) : items.length === 0 ? (
            <MotionSection className="text-center py-20">
              <div className="w-20 h-20 mx-auto rounded-full bg-white border border-cream-200 flex items-center justify-center mb-6 shadow-soft">
                <ImageIcon
                  className="w-6 h-6 text-muted-foreground"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-display text-2xl font-medium text-foreground">
                {searchTerm ? "No matches" : "The library is being curated"}
              </h3>
              <p className="mt-2 text-muted-foreground max-w-sm mx-auto text-pretty">
                {searchTerm
                  ? "Try a different term."
                  : "Compositions will appear here as the atelier adds them."}
              </p>
            </MotionSection>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6 [column-fill:_balance]">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.7,
                    delay: (index % 4) * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="mb-5 sm:mb-6 break-inside-avoid"
                  onClick={() =>
                    item.mediaUrl?.[0]?.url &&
                    setSelectedImage({
                      url: item.mediaUrl[0].url,
                      title: item.title,
                    })
                  }
                >
                  <div
                    className="group relative overflow-hidden rounded-2xl bg-white border border-cream-200/80 shadow-soft cursor-pointer hover:shadow-card hover:border-primary/20 transition-all"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent z-10" />
                    {item.mediaUrl && item.mediaUrl.length > 0 ? (
                      <div className="relative overflow-hidden">
                        <motion.img
                          src={item.mediaUrl[0].url}
                          alt={item.title}
                          className="w-full h-auto object-cover"
                          initial={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                          <div className="w-10 h-10 rounded-full bg-white border border-cream-200 flex items-center justify-center ml-auto shadow-soft">
                            <ArrowUpRight
                              className="w-4 h-4 text-primary"
                              strokeWidth={1.8}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-sage-50 via-cream-100 to-rose/20">
                        <ImageIcon
                          className="w-10 h-10 text-muted-foreground/50"
                          strokeWidth={1.2}
                        />
                      </div>
                    )}
                    <div className="p-4 bg-white">
                      <h3 className="font-display text-sm font-medium text-foreground line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-foreground/85 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/15 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" strokeWidth={1.8} />
            </motion.button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full max-h-[80vh] object-contain rounded-2xl shadow-elevated border border-white/10"
              />
              <p className="font-display text-lg sm:text-xl text-white text-center mt-5 text-balance">
                {selectedImage.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
