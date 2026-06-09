import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Flower2,
  Mail,
  Lock,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState(
    (location.state as { email?: string } | null)?.email ?? ""
  );
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fromState = (location.state as { from?: string } | null)?.from;
  const searchParams = new URLSearchParams(location.search);
  const reason = searchParams.get("reason");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success("Welcome back");
      if (fromState && fromState !== "/login") {
        navigate(fromState, { replace: true });
      } else {
        const isAdminLogin =
          result.user?.role === "admin" || result.user?.role === "superadmin";
        const target = isAdminLogin ? "/admin" : "/account/orders";
        navigate(target, { replace: true });
      }
    } else {
      const errorMsg = result.error || "Login failed";
      if (errorMsg.toLowerCase().includes("otp") || errorMsg.toLowerCase().includes("verify")) {
        navigate("/verify-otp", {
          state: { email, from: fromState },
          replace: true,
        });
      } else {
        toast.error(errorMsg);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative flex items-center justify-center p-4 py-20">
      <GradientOrbs variant="cinematic" />

      <div className="relative w-full max-w-md">
        <MotionSection>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              strokeWidth={1.8}
            />
            Back to atelier
          </Link>

          <div
            className="relative rounded-3xl overflow-hidden bg-white border border-cream-200/80 shadow-card"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="p-7 sm:p-10">
              <div className="flex flex-col items-center text-center mb-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative w-16 h-16 mb-5"
                >
                  <div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(74,29,107,0.25), rgba(200,162,74,0.2))",
                    }}
                  />
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center shadow-glow"
                    style={{
                      background:
                        "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                    }}
                  >
                    <Flower2
                      className="w-7 h-7 text-primary-foreground"
                      strokeWidth={2.2}
                    />
                  </div>
                </motion.div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                    Maison Florelle
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
                  Welcome{" "}
                  <span className="italic font-serif gradient-text-gold">back</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-2 text-pretty">
                  Sign in to continue your visit
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@maisonflorelle.com"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading}
                  className="group w-full h-12 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <LuxurySpinner size={18} />
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowUpRight
                        className="w-4 h-4 group-hover:rotate-45 transition-transform"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign up
                </Link>
              </p>

              <div className="mt-7 pt-6 border-t border-cream-200 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                <ShieldCheck className="w-3 h-3 text-primary" strokeWidth={2} />
                End-to-end encrypted
              </div>
            </div>
          </div>
        </MotionSection>
      </div>
    </div>
  );
};

export default Login;
