import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Flower2,
  User,
  LogOut,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "px-3 sm:px-5 pt-3" : "px-0 pt-0"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500",
          scrolled
            ? "max-w-6xl glass rounded-full px-3 sm:px-5 h-14 sm:h-16 shadow-card"
            : "max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20"
        )}
      >
        {/* Logo */}
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-soft transition-transform duration-500 group-hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
              }}
            >
              <Flower2
                className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground"
                strokeWidth={2.2}
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-display text-base sm:text-lg font-semibold text-foreground tracking-tight">
              Maison Florelle
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">
              Admin Console
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/"
            className="px-3.5 py-1.5 text-[13px] font-medium text-foreground/75 hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            View Store
          </Link>

          <Link
            to="/login"
            className="group relative inline-flex items-center gap-2 px-5 py-2 text-[13px] font-semibold rounded-full text-primary-foreground shadow-soft transition-all duration-300 hover:shadow-glow hover:scale-105 active:scale-95 overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-110"
              style={{
                background:
                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
              }}
            />
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, #6B3D96 0%, #C8A24A 50%, #4A1D6B 130%)",
              }}
            />
            <User className="relative w-3.5 h-3.5" />
            <span className="relative">Sign In</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative p-2 sm:p-2.5 rounded-full text-foreground hover:bg-primary/[0.06] transition-colors"
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-40 bg-primary/30 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed top-20 sm:top-24 left-3 right-3 z-50 glass-strong rounded-3xl overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-1">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 mb-1 rounded-2xl bg-primary/[0.06]">
                      <p className="text-sm font-semibold text-foreground">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/[0.06]"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Admin console
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-60" />
                    </Link>
                    <Link
                      to="/account/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/[0.06]"
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Account
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-60" />
                    </Link>
                    <div className="luxury-divider my-2" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium text-rose-deep hover:bg-rose/15 w-full"
                    >
                      <span className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-2xl text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/[0.06]"
                    >
                      View Store
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 px-4 py-3 rounded-2xl text-center text-primary-foreground text-[14px] font-semibold shadow-soft"
                      style={{
                        background:
                          "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                      }}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 px-4 py-3 rounded-2xl text-center border border-cream-200/80 text-[14px] font-semibold text-foreground hover:border-primary/30 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
