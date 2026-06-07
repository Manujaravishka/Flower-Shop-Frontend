import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import { cn } from "@/lib/utils";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <ClientNavbar />
        <main className="pt-32 pb-16 relative">
          <GradientOrbs variant="subtle" />
          <div className="container mx-auto px-4 lg:px-6 relative">
            <MotionSection className="max-w-md mx-auto text-center py-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-28 h-28 mx-auto mb-8"
              >
                <div
                  className="absolute inset-0 rounded-full blur-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(244, 194, 194, 0.55), rgba(200, 162, 74, 0.4))",
                  }}
                />
                <div
                  className="relative w-full h-full rounded-full bg-white border border-cream-200 flex items-center justify-center shadow-soft"
                >
                  <ShoppingBag
                    className="w-10 h-10 text-primary"
                    strokeWidth={1.4}
                  />
                </div>
              </motion.div>
              <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-[1.05] tracking-tight text-balance">
                Your bag is{" "}
                <span className="italic font-serif gradient-text-gold">empty</span>
              </h1>
              <p className="mt-4 text-muted-foreground text-pretty">
                Begin composing your story — explore the atelier.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                  }}
                >
                  Browse collection
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                    strokeWidth={2}
                  />
                </Link>
                <Link
                  to="/customize"
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white border border-cream-200 text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 text-gold" strokeWidth={1.8} />
                  Design with AI
                </Link>
              </div>
            </MotionSection>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <section className="relative">
          <GradientOrbs variant="subtle" />
          <div className="container mx-auto px-4 lg:px-6 relative">
            <MotionSection>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  Your Selection
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-medium text-foreground leading-[0.96] tracking-[-0.025em]">
                The <span className="italic font-serif gradient-text-gold">bag</span>
              </h1>
              <p className="mt-4 text-muted-foreground">
                {items.length} {items.length === 1 ? "composition" : "compositions"} ready
                for the atelier
              </p>
            </MotionSection>

            <div className="mt-12 grid lg:grid-cols-3 gap-6 lg:gap-10">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{
                        opacity: 0,
                        x: -50,
                        transition: { duration: 0.3 },
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div
                        className="relative rounded-2xl p-3 sm:p-4 group bg-white border border-cream-200/80 shadow-soft hover:shadow-card transition-all"
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent rounded-t-2xl" />
                        <div className="flex gap-4">
                          {/* Image */}
                          <Link
                            to={`/product/${item._id}`}
                            className="relative w-24 h-28 sm:w-32 sm:h-36 rounded-xl overflow-hidden flex-shrink-0 border border-cream-200 shadow-soft"
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  background:
                                    "linear-gradient(135deg, #F4C2C2 0%, #C8A24A 100%)",
                                }}
                              >
                                <span className="text-3xl opacity-60">🌸</span>
                              </div>
                            )}
                          </Link>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap gap-1 mb-1.5">
                                  {item.category.slice(0, 2).map((cat) => (
                                    <span
                                      key={cat}
                                      className="px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-[0.18em] bg-cream-100 text-muted-foreground border border-cream-200"
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                  {item.isCustom && (
                                    <span
                                      className="px-2 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-[0.18em] text-primary-foreground"
                                      style={{
                                        background:
                                          "linear-gradient(135deg, #1B4332 0%, #C8A24A 130%)",
                                      }}
                                    >
                                      <Sparkles className="w-2.5 h-2.5 inline-block -mt-0.5 mr-1" />
                                      Custom
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-display text-base sm:text-lg font-medium text-foreground truncate">
                                  {item.name}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.colour}
                                  <span className="mx-1.5 opacity-40">·</span>
                                  {item.size}
                                </p>
                                {item.customPrompt && (
                                  <p className="text-xs text-muted-foreground/80 mt-1 italic line-clamp-1">
                                    "{item.customPrompt}"
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="p-2 rounded-full text-muted-foreground hover:text-rose-deep hover:bg-rose/15 transition-all"
                                aria-label="Remove from bag"
                              >
                                <Trash2
                                  className="w-4 h-4"
                                  strokeWidth={1.8}
                                />
                              </button>
                            </div>

                            <div className="mt-auto pt-3 flex items-end justify-between">
                              <div className="flex items-center gap-1 p-0.5 rounded-full bg-white border border-cream-200 shadow-soft">
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity - 1)
                                  }
                                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/[0.06] text-foreground/80 hover:text-primary transition-colors"
                                >
                                  <Minus
                                    className="w-3.5 h-3.5"
                                    strokeWidth={2}
                                  />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/[0.06] text-foreground/80 hover:text-primary transition-colors"
                                >
                                  <Plus
                                    className="w-3.5 h-3.5"
                                    strokeWidth={2}
                                  />
                                </button>
                              </div>
                              <p className="font-display text-lg sm:text-xl font-semibold text-primary tracking-tight">
                                <span className="text-xs text-muted-foreground/80 font-normal mr-0.5">
                                  Rs.
                                </span>
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={clearCart}
                  className="mt-4 text-xs text-muted-foreground hover:text-rose-deep transition-colors flex items-center gap-1.5 uppercase tracking-[0.2em]"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={1.8} />
                  Clear bag
                </motion.button>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <MotionSection delay={0.15}>
                  <div className="sticky top-28">
                    <div
                      className="relative rounded-3xl overflow-hidden bg-white border border-cream-200/80 shadow-card"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                      <div className="p-6 sm:p-7">
                        <h2 className="font-display text-xl font-medium text-foreground mb-6">
                          Order summary
                        </h2>

                        <div className="space-y-3.5 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Subtotal
                            </span>
                            <span className="font-medium text-foreground">
                              Rs. {totalPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Delivery
                            </span>
                            <span className="text-primary font-medium">
                              Complimentary
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Gift wrap
                            </span>
                            <span className="text-primary font-medium">
                              Complimentary
                            </span>
                          </div>
                        </div>

                        <div className="luxury-divider mb-5" />

                        <div className="flex items-baseline justify-between mb-6">
                          <span className="font-display text-base font-medium text-foreground">
                            Total
                          </span>
                          <span className="font-display text-3xl font-medium gradient-text-gold tracking-tight">
                            Rs. {totalPrice.toLocaleString()}
                          </span>
                        </div>

                        <Link
                          to="/checkout"
                          className="group flex items-center justify-center gap-2 h-13 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
                          style={{
                            background:
                              "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                          }}
                        >
                          Proceed to checkout
                          <ArrowUpRight
                            className="w-4 h-4 group-hover:rotate-45 transition-transform"
                            strokeWidth={2}
                          />
                        </Link>

                        <Link
                          to="/products"
                          className="mt-3 flex items-center justify-center gap-2 h-11 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ArrowRight
                            className="w-3.5 h-3.5 rotate-180"
                            strokeWidth={2}
                          />
                          Continue shopping
                        </Link>
                      </div>
                    </div>

                    {/* Trust strip */}
                    <div className="mt-4 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      <span>Secure</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span>Encrypted</span>
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                      <span>Same-day</span>
                    </div>
                  </div>
                </MotionSection>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
