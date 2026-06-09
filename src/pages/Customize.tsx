import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Sparkles,
  Palette,
  ImageIcon,
  ShoppingBag,
  RefreshCw,
  Check,
  Loader2,
  ArrowUpRight,
  X,
} from "lucide-react";
import { libraryApi, aiApi } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";

const Customize = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [library, setLibrary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const colorOptions = [
    "Pink",
    "Red",
    "Yellow",
    "Purple",
    "White",
    "Orange",
    "Blue",
    "Mixed",
  ];
  const flowerTypes = [
    "Roses",
    "Sunflowers",
    "Lilies",
    "Tulips",
    "Orchids",
    "Daisies",
    "Mixed",
  ];

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await libraryApi.getAll();
        if (Array.isArray(data)) {
          setLibrary(data);
        }
      } catch (error) {
        console.error("Error fetching library:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  const toggleImageSelection = (url: string) => {
    setSelectedImages((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleGenerate = async () => {
    if (selectedImages.length === 0 && !prompt) {
      toast.error("Please select references or describe your design");
      return;
    }

    setIsGenerating(true);
    try {
      const data = await aiApi.generate({
        imageUrls: selectedImages,
        prompt: prompt || "Create a beautiful flower arrangement",
      });

      if (!data.success) {
        throw new Error(data.message || "Generation failed");
      }

      if (!data.imageUrl) {
        throw new Error("No image returned");
      }

      setGeneratedImage(data.imageUrl);
      toast.success("Design generated");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate design. Please try again.");
      setGeneratedImage(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = () => {
    if (!generatedImage) return;

    addToCart({
      _id: `custom-${Date.now()}`,
      name: "Bespoke Design",
      price: 5000,
      colour: "Custom",
      size: "CUSTOM",
      category: ["CUSTOM"],
      imageUrl: generatedImage,
      isCustom: true,
      customPrompt: prompt,
    });

    toast.success("Bespoke design added to bag");
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <GradientOrbs variant="cinematic" />
          <div className="container mx-auto px-4 lg:px-6 relative py-16 sm:py-20">
            <div className="max-w-3xl">
              <MotionSection>
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                    <Wand2
                      className="w-3 h-3 inline-block -mt-0.5 mr-1.5"
                      strokeWidth={2}
                    />
                    AI Atelier
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[0.96] tracking-[-0.025em] text-balance">
                  Compose something{" "}
                  <span className="italic font-serif gradient-text-gold">unrepeatable</span>
                </h1>
                <p className="mt-5 text-muted-foreground max-w-xl text-pretty text-lg">
                  Select references, describe your vision, and let our AI co-design
                  your arrangement.
                </p>
              </MotionSection>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 lg:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              {/* References */}
              <MotionSection>
                <div
                  className="rounded-2xl overflow-hidden bg-white border border-cream-200/80 shadow-soft"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soft"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(74, 29, 107, 0.1), rgba(244, 194, 194, 0.18))",
                          border: "1px solid rgba(74, 29, 107, 0.15)",
                        }}
                      >
                        <ImageIcon
                          className="w-4 h-4 text-primary"
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-medium text-foreground">
                          Reference compositions
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Select existing pieces for inspiration
                        </p>
                      </div>
                      {selectedImages.length > 0 && (
                        <button
                          onClick={() => setSelectedImages([])}
                          className="ml-auto text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-rose-deep transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Clear
                        </button>
                      )}
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <LuxurySpinner size={32} />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {(library.length > 0
                          ? library.map((item) => ({
                              _id: item._id,
                              url: item.mediaUrl?.[0]?.url,
                            }))
                          : [
                              "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1518882605630-8eb256a2c4c7?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=300&h=300&fit=crop",
                              "https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=300&h=300&fit=crop",
                            ].map((url, i) => ({ _id: `ph-${i}`, url }))
                        ).map((item: any) => {
                          const isSelected = selectedImages.includes(item.url);
                          return (
                            <motion.button
                              key={item._id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                item.url && toggleImageSelection(item.url)
                              }
                              className={cn(
                                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all shadow-soft",
                                isSelected
                                  ? "border-primary"
                                  : "border-white hover:border-primary/40"
                              )}
                            >
                              {item.url && (
                                <img
                                  src={item.url}
                                  alt="Reference"
                                  className="w-full h-full object-cover"
                                />
                              )}
                              {isSelected && (
                                <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center shadow-soft"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                                    }}
                                  >
                                    <Check
                                      className="w-4 h-4 text-primary-foreground"
                                      strokeWidth={2.5}
                                    />
                                  </div>
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </MotionSection>

              {/* Quick options */}
              <MotionSection delay={0.1}>
                <div
                  className="rounded-2xl overflow-hidden bg-white border border-cream-200/80 shadow-soft"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soft"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(74, 29, 107, 0.1), rgba(244, 194, 194, 0.18))",
                          border: "1px solid rgba(74, 29, 107, 0.15)",
                        }}
                      >
                        <Palette
                          className="w-4 h-4 text-primary"
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-medium text-foreground">
                          Quick selection
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Tap to add to your prompt
                        </p>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-3">
                          Colours
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() =>
                                setPrompt((prev) => `${prev} ${color} colour`)
                              }
                              className="h-9 px-4 rounded-full text-xs font-medium bg-white border border-cream-200 text-foreground/75 hover:text-primary hover:border-primary/30 hover:shadow-soft transition-all"
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-3">
                          Flowers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {flowerTypes.map((type) => (
                            <button
                              key={type}
                              onClick={() =>
                                setPrompt((prev) => `${prev} with ${type}`)
                              }
                              className="h-9 px-4 rounded-full text-xs font-medium bg-white border border-cream-200 text-foreground/75 hover:text-primary hover:border-primary/30 hover:shadow-soft transition-all"
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MotionSection>

              {/* Prompt */}
              <MotionSection delay={0.2}>
                <div
                  className="rounded-2xl overflow-hidden bg-white border border-cream-200/80 shadow-soft"
                >
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soft"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(74, 29, 107, 0.1), rgba(244, 194, 194, 0.18))",
                          border: "1px solid rgba(74, 29, 107, 0.15)",
                        }}
                      >
                        <Sparkles
                          className="w-4 h-4 text-primary"
                          strokeWidth={1.8}
                        />
                      </div>
                      <div>
                        <h2 className="font-display text-xl font-medium text-foreground">
                          Your vision
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          The more detail, the better
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="E.g. A romantic pink and white rose bouquet with baby's breath, elegant wrapping — perfect for a wedding."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all resize-none"
                    />

                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="mt-5 w-full h-12 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      style={{
                        background:
                          "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2
                            className="w-4 h-4 animate-spin"
                            strokeWidth={2}
                          />
                          Generating your design
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" strokeWidth={2} />
                          Generate design
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </MotionSection>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-1">
              <MotionSection delay={0.25}>
                <div className="sticky top-28">
                  <div
                    className="relative rounded-3xl overflow-hidden bg-white border border-cream-200/80 shadow-card"
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                    <div className="p-6 sm:p-7">
                      <h2 className="font-display text-xl font-medium text-foreground mb-5">
                        Design preview
                      </h2>

                      <div className="aspect-square rounded-2xl overflow-hidden bg-cream-100 border border-cream-200 mb-5 relative shadow-soft">
                        <AnimatePresence mode="wait">
                          {generatedImage ? (
                            <motion.img
                              key={generatedImage}
                              initial={{ opacity: 0, scale: 1.05 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.6 }}
                              src={generatedImage}
                              alt="Generated design"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-6 text-center"
                            >
                              {isGenerating ? (
                                <LuxurySpinner size={40} />
                              ) : (
                                <>
                                  <Wand2
                                    className="w-8 h-8 mb-3 text-gold/70"
                                    strokeWidth={1.2}
                                  />
                                  <p className="text-sm">
                                    Your design will appear here
                                  </p>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {generatedImage && (
                        <div className="space-y-4">
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                Bespoke
                              </p>
                              <p className="font-display text-lg font-medium text-foreground mt-1">
                                Your composition
                              </p>
                            </div>
                            <p className="font-display text-2xl font-medium gradient-text-gold">
                              <span className="text-xs text-muted-foreground/80 font-normal mr-0.5">
                                Rs.
                              </span>
                              5,000
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={handleGenerate}
                              disabled={isGenerating}
                              className="flex-1 h-11 rounded-full bg-white border border-cream-200 text-sm font-medium text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                              <RefreshCw
                                className={cn(
                                  "w-3.5 h-3.5",
                                  isGenerating && "animate-spin"
                                )}
                                strokeWidth={1.8}
                              />
                              Regenerate
                            </button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={handleAddToCart}
                              className="flex-1 h-11 rounded-full text-primary-foreground text-sm font-medium shadow-soft flex items-center justify-center gap-1.5 hover:shadow-glow transition-all"
                              style={{
                                background:
                                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                              }}
                            >
                              <ShoppingBag
                                className="w-3.5 h-3.5"
                                strokeWidth={2}
                              />
                              Add to bag
                            </motion.button>
                          </div>

                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center">
                            Hand-finished within 24h
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </MotionSection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Customize;
