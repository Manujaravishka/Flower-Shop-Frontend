import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ShoppingBag,
  Home,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <section className="relative">
          <GradientOrbs variant="cinematic" />
          <div className="container mx-auto px-4 lg:px-6 relative">
            <div className="max-w-lg mx-auto text-center py-12 sm:py-20">
              <MotionSection>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative w-28 h-28 mx-auto mb-10"
                >
                  {/* Pulsing rings */}
                  <div
                    className="absolute inset-0 rounded-full animate-pulse-soft"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(27,67,50,0.18), transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute inset-2 rounded-full animate-pulse-soft"
                    style={{
                      animationDelay: "0.4s",
                      background:
                        "radial-gradient(circle, rgba(200,162,74,0.22), transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute inset-4 rounded-full flex items-center justify-center shadow-glow"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                    }}
                  >
                    <Check
                      className="w-12 h-12 text-primary-foreground"
                      strokeWidth={2.4}
                    />
                  </div>
                </motion.div>
              </MotionSection>

              <MotionSection delay={0.2}>
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                    Confirmed
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-5xl sm:text-6xl font-medium text-foreground leading-[0.96] tracking-[-0.025em]">
                  Order{" "}
                  <span className="italic font-serif gradient-text-gold">
                    placed
                  </span>
                </h1>
                <p className="mt-5 text-muted-foreground text-pretty text-lg">
                  Thank you. Our florists will begin hand-tying your
                  arrangement.
                </p>
              </MotionSection>

              <MotionSection delay={0.3}>
                <div
                  className="mt-10 rounded-2xl overflow-hidden text-left bg-white border border-cream-200/80 shadow-soft"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                  <div className="p-6">
                    <h3 className="font-display text-base font-medium text-foreground mb-5 flex items-center gap-2">
                      <Sparkles
                        className="w-4 h-4 text-primary"
                        strokeWidth={1.8}
                      />
                      What happens next
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          num: "01",
                          text: "Your florist hand-ties the arrangement",
                        },
                        {
                          num: "02",
                          text: "You'll receive a confirmation by phone",
                        },
                        {
                          num: "03",
                          text: "Delivered fresh to your door",
                        },
                      ].map((item) => (
                        <div
                          key={item.num}
                          className="flex items-center gap-4"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-display font-medium text-primary bg-cream-50 border border-cream-200"
                          >
                            {item.num}
                          </div>
                          <p className="text-sm text-foreground/90">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </MotionSection>

              <MotionSection delay={0.4}>
                <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    to="/products"
                    className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={2} />
                    Continue shopping
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white border border-cream-200 text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all text-sm font-medium"
                  >
                    <Home className="w-4 h-4" strokeWidth={1.8} />
                    Back home
                  </Link>
                </div>
              </MotionSection>

              <MotionSection delay={0.5}>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="uppercase tracking-[0.2em]">
                    Questions?
                  </span>
                  <a
                    href="tel:+94784589109"
                    className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <Phone
                      className="w-3 h-3 text-primary"
                      strokeWidth={2}
                    />
                    +94 78 458 9109
                  </a>
                  <span className="hidden sm:inline opacity-30">·</span>
                  <a
                    href="mailto:thisarawismini97@gmail.com"
                    className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <Mail
                      className="w-3 h-3 text-primary"
                      strokeWidth={2}
                    />
                    Email us
                  </a>
                </div>
              </MotionSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
