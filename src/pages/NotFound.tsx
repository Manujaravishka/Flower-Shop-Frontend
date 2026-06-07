import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/luxury/GradientOrbs";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <ClientNavbar />
      <main className="flex-1 relative flex items-center justify-center pt-24 pb-16">
        <GradientOrbs variant="cinematic" />
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="max-w-xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display text-[8rem] sm:text-[12rem] font-medium text-foreground leading-none tracking-[-0.05em]">
                <span className="gradient-text-gold">4</span>
                <span className="italic font-serif">0</span>
                <span className="gradient-text-gold">4</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                  Lost
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
                This page has{" "}
                <span className="italic font-serif gradient-text-gold">
                  wilted
                </span>
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty max-w-md mx-auto">
                The composition you are looking for has slipped from the
                atelier. Return to the collection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
                style={{
                  background:
                    "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                }}
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Return home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white border border-cream-200 text-foreground hover:bg-cream-50 hover:border-primary/30 transition-all text-sm font-medium"
              >
                Browse collection
                <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
