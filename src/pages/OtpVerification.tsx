import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flower2,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { otpApi } from "@/lib/api";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const OtpVerification = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const email = (location.state as { email?: string } | null)?.email ?? "";
  const fromState = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < text.length; i++) {
      newOtp[i] = text[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(text.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await otpApi.verify({ email, otp: code });
      const result = await login(email, "");
      if (result.success) {
        toast.success("Verified successfully");
        if (fromState && fromState !== "/login") {
          navigate(fromState, { replace: true });
        } else {
          navigate("/account/orders", { replace: true });
        }
      } else {
        toast.error("Please sign in with your credentials");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Verification failed";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;
    setIsResending(true);
    try {
      await otpApi.send({ email });
      toast.success("Code resent to your email");
      setCountdown(30);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to resend";
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative flex items-center justify-center p-4 py-20">
      <GradientOrbs variant="cinematic" />

      <div className="relative w-full max-w-md">
        <MotionSection>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              strokeWidth={1.8}
            />
            Back to sign in
          </Link>

          <div className="relative rounded-3xl overflow-hidden bg-white border border-cream-200/80 shadow-card">
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
                        "linear-gradient(135deg, rgba(27,67,50,0.25), rgba(200,162,74,0.2))",
                    }}
                  />
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center shadow-glow"
                    style={{
                      background:
                        "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                    }}
                  >
                    <Smartphone
                      className="w-7 h-7 text-primary-foreground"
                      strokeWidth={2.2}
                    />
                  </div>
                </motion.div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                    Two-factor verification
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
                  Verify your{" "}
                  <span className="italic font-serif gradient-text-gold">identity</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-2 text-pretty">
                  Enter the 6-digit code sent to{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={cn(
                        "w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-xl border text-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all",
                        digit ? "border-primary/40 shadow-soft" : "border-cream-200"
                      )}
                    />
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isLoading || otp.join("").length !== 6}
                  className="group w-full h-12 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #1B4332 0%, #2D5A45 50%, #C8A24A 130%)",
                  }}
                >
                  {isLoading ? (
                    <>
                      <LuxurySpinner size={18} />
                      Verifying
                    </>
                  ) : (
                    <>
                      Verify code
                      <ArrowUpRight
                        className="w-4 h-4 group-hover:rotate-45 transition-transform"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isResending && "animate-spin")} strokeWidth={2} />
                  {countdown > 0
                    ? `Resend code in ${countdown}s`
                    : isResending
                      ? "Sending…"
                      : "Resend code"}
                </button>
              </div>

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

export default OtpVerification;
