import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  X,
  Flower2,
  ShoppingBag,
  Sparkles,
  Lock,
  User,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Shop" },
  { path: "/categories", label: "Collections" },
  { path: "/customize", label: "Atelier", icon: Sparkles },
  { path: "/gallery", label: "Gallery" },
];

const ClientNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "MF";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      >
        <div
          className={cn(
            "mx-auto transition-all duration-500",
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
            <Link to="/" className="flex items-center gap-2.5 group relative z-10">
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
                  Floral Atelier
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1 transition-all duration-500",
                  scrolled
                    ? "bg-white/60 border border-cream-200/80 rounded-full px-1.5 py-1"
                    : "gap-2"
                )}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "relative px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 rounded-full flex items-center gap-1.5",
                      isActive(link.path)
                        ? scrolled
                          ? "text-primary-foreground"
                          : "text-primary"
                        : "text-foreground/70 hover:text-primary"
                    )}
                  >
                    {isActive(link.path) && !scrolled && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-primary/[0.08] border border-primary/15"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    {isActive(link.path) && scrolled && (
                      <motion.span
                        layoutId="nav-active-scrolled"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.icon && (
                        <link.icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                      )}
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/cart"
                className="relative p-2 sm:p-2.5 rounded-full text-foreground/80 hover:text-primary hover:bg-primary/[0.06] transition-all duration-300 group"
                aria-label="Cart"
              >
                <ShoppingBag
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  strokeWidth={1.8}
                />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-5 px-1 rounded-full text-primary-foreground text-[10px] sm:text-[11px] font-semibold flex items-center justify-center shadow-soft"
                    style={{
                      background:
                        "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                    }}
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="hidden md:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-cream-200/80 hover:border-primary/30 hover:bg-white/70 transition-all duration-300">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-primary-foreground"
                        style={{
                          background:
                            "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                        }}
                      >
                        {userInitials}
                      </div>
                      <span className="text-[13px] font-medium text-foreground/90 max-w-[100px] truncate">
                        {user?.name?.split(" ")[0] || "User"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 glass-strong border-cream-200/80 rounded-2xl p-2"
                  >
                    <div className="px-3 py-2.5 mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-cream-200" />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/account/profile"
                        className="cursor-pointer rounded-xl px-3 py-2 text-sm focus:bg-primary/[0.06]"
                      >
                        <User className="w-4 h-4 mr-2.5" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/account/orders"
                        className="cursor-pointer rounded-xl px-3 py-2 text-sm focus:bg-primary/[0.06]"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2.5" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-cream-200" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-xl px-3 py-2 text-sm text-rose-deep focus:bg-rose/15 focus:text-rose-deep"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-medium text-foreground/75 hover:text-primary border border-cream-200/80 hover:border-primary/30 hover:bg-white/60 transition-all duration-300"
                >
                  <Lock className="w-3.5 h-3.5" strokeWidth={2} />
                  Admin
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden relative p-2 sm:p-2.5 rounded-full text-foreground hover:bg-primary/[0.06] transition-colors"
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
                      <X className="w-5 h-5" strokeWidth={1.8} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" strokeWidth={1.8} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40 bg-primary/30 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-20 sm:top-24 left-3 right-3 z-50 glass-strong rounded-3xl overflow-hidden"
            >
              <div className="p-5 sm:p-6 flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-2xl text-[15px] font-medium transition-all",
                        isActive(link.path)
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/[0.06]"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {link.icon && (
                          <link.icon className="w-4 h-4" strokeWidth={1.8} />
                        )}
                        {link.label}
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-60" />
                    </Link>
                  </motion.div>
                ))}
                <div className="luxury-divider my-3" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-1">
                      <div className="px-4 py-3 rounded-2xl bg-primary/[0.06] mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/account/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/[0.06] transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          My Profile
                        </span>
                        <ArrowUpRight className="w-4 h-4 opacity-60" />
                      </Link>
                      <Link
                        to="/account/orders"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/[0.06] transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4" />
                          My Orders
                        </span>
                        <ArrowUpRight className="w-4 h-4 opacity-60" />
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-medium text-rose-deep hover:bg-rose/15 transition-all w-full"
                      >
                        <span className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </span>
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-[14px] font-medium text-foreground/80 hover:text-primary hover:bg-primary/[0.06] transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Admin Portal
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-60" />
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientNavbar;
