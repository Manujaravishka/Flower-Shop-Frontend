import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flower2,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import GradientOrbs from "./luxury/GradientOrbs";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream-100 to-cream-200" />
      <GradientOrbs variant="cinematic" />

      {/* Hairline top */}
      <div className="relative">
        <div className="luxury-divider" />

        {/* Newsletter strip */}
        <div className="container mx-auto px-4 lg:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl sm:rounded-[2rem] overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #1B4332 0%, #2D5A45 70%, #C8A24A 130%)",
              boxShadow:
                "0 30px 80px -30px rgba(27, 67, 50, 0.45), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/40 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-rose/40 blur-3xl" />
            </div>
            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center p-8 sm:p-12 lg:p-16">
              <div>
                <div className="inline-flex items-center gap-2 mb-5">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/80" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-gold-soft">
                    The Florelle Letter
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-primary-foreground leading-[1.05] tracking-tight text-balance">
                  Receive the season's
                  <br />
                  <span className="italic font-serif text-gold-soft">
                    finest arrangements
                  </span>
                </h3>
                <p className="mt-4 text-primary-foreground/75 text-pretty max-w-md">
                  Quiet, considered dispatches on new collections, exclusive offers
                  and floral inspiration.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/55 focus:outline-none focus:border-gold/60 focus:bg-white/15 transition-all text-sm backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-full text-primary font-medium text-sm transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg, #C8A24A 0%, #E0C075 100%)",
                    boxShadow: "0 18px 40px -16px rgba(200, 162, 74, 0.55)",
                  }}
                >
                  Subscribe
                  <ArrowUpRight
                    className="w-4 h-4 group-hover:rotate-45 transition-transform"
                    strokeWidth={2}
                  />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Main Footer */}
        <div className="container mx-auto px-4 lg:px-6 pb-12">
          <div className="grid md:grid-cols-12 gap-10 lg:gap-12">
            {/* Brand */}
            <div className="md:col-span-4">
              <Link to="/" className="flex items-center gap-2.5 mb-5 group">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform"
                  style={{
                    background:
                      "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                  }}
                >
                  <Flower2
                    className="w-5 h-5 text-primary-foreground"
                    strokeWidth={2.2}
                  />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display text-lg font-semibold text-foreground tracking-tight">
                    Maison Florelle
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
                    Floral Atelier
                  </span>
                </div>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                A house of floristry crafting considered, modern arrangements. Each
                bloom is selected by hand and composed with intent.
              </p>
              <div className="mt-6 flex items-center gap-2">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/80 border border-cream-200 flex items-center justify-center text-foreground/70 hover:text-primary hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-soft transition-all"
                    aria-label="Social link"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="md:col-span-2">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/90 mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Shop All", path: "/products" },
                  { label: "Collections", path: "/categories" },
                  { label: "Atelier", path: "/customize" },
                  { label: "Gallery", path: "/gallery" },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/90 mb-5">
                Categories
              </h4>
              <ul className="space-y-3">
                {["Bouquets", "Pots", "Succulents", "Custom"].map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/categories?filter=${cat.toLowerCase()}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {cat}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-4">
              <h4 className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/90 mb-5">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/80 border border-cream-200 flex items-center justify-center flex-shrink-0">
                    <MapPin
                      className="w-3.5 h-3.5 text-primary"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Sandamira, Athalahena, Wawulugala,
                    <br />
                    Galle, Sri Lanka
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/80 border border-cream-200 flex items-center justify-center flex-shrink-0">
                    <Phone
                      className="w-3.5 h-3.5 text-primary"
                      strokeWidth={2}
                    />
                  </div>
                  <a
                    href="tel:+94743564951"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    +94 74 356 4951
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/80 border border-cream-200 flex items-center justify-center flex-shrink-0">
                    <Mail
                      className="w-3.5 h-3.5 text-primary"
                      strokeWidth={2}
                    />
                  </div>
                  <a
                    href="mailto:thisarawismini97@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    thisarawismini97@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="container mx-auto px-4 lg:px-6 pb-10">
          <div className="luxury-divider mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              © 2026 Maison Florelle. Crafted with{" "}
              <Heart
                className="w-3 h-3 text-rose-deep fill-rose"
                strokeWidth={1.5}
              />{" "}
              for flower lovers.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
