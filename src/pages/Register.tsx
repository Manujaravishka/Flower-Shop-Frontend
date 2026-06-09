import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Flower2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SL_PHONE_REGEX = /^(?:\+94|0)7[0-9]{8}$/;
const MIN_PASSWORD_LENGTH = 8;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const DIGIT_REGEX = /[0-9]/;
const SYMBOL_REGEX = /[^A-Za-z0-9]/;

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Full name is required";
  } else if (values.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    const normalizedPhone = values.phone.replace(/[\s-]/g, "");
    if (!SL_PHONE_REGEX.test(normalizedPhone)) {
      errors.phone = "Enter a valid Sri Lankan mobile number (e.g. 0771234567)";
    }
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else {
    const pwd = values.password;
    if (pwd.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    } else if (!UPPERCASE_REGEX.test(pwd)) {
      errors.password = "Password must include an uppercase letter";
    } else if (!LOWERCASE_REGEX.test(pwd)) {
      errors.password = "Password must include a lowercase letter";
    } else if (!DIGIT_REGEX.test(pwd)) {
      errors.password = "Password must include a number";
    } else if (!SYMBOL_REGEX.test(pwd)) {
      errors.password = "Password must include a symbol";
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

const Register = () => {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    const pwd = values.password;
    if (!pwd) return { label: "", tone: "" };
    let score = 0;
    if (pwd.length >= MIN_PASSWORD_LENGTH) score++;
    if (UPPERCASE_REGEX.test(pwd)) score++;
    if (LOWERCASE_REGEX.test(pwd)) score++;
    if (DIGIT_REGEX.test(pwd)) score++;
    if (SYMBOL_REGEX.test(pwd)) score++;

    if (score <= 2) return { label: "Weak", tone: "bg-rose-deep/70" };
    if (score === 3) return { label: "Fair", tone: "bg-amber-500" };
    if (score === 4) return { label: "Good", tone: "bg-emerald-500" };
    return { label: "Strong", tone: "bg-primary" };
  }, [values.password]);

  const updateField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextValues = { ...values, [field]: e.target.value };
    setValues(nextValues);
    if (touched[field]) {
      setErrors(validate(nextValues));
    }
  };

  const handleBlur = (field: keyof FormState) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validate(values);
    setErrors(validation);
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(validation).length > 0) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.replace(/[\s-]/g, ""),
        password: values.password,
        accountType: "customer",
      });

      if (!result.success) {
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("Account created. Please sign in.");
      navigate("/login", {
        replace: true,
        state: { email: values.email.trim() },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (field: keyof FormState) => touched[field] && errors[field];

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
                    Create account
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]">
                  Join the{" "}
                  <span className="italic font-serif gradient-text-gold">atelier</span>
                </h1>
                <p className="text-muted-foreground text-sm mt-2 text-pretty">
                  Sign up to start curating bespoke bouquets
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={updateField("name")}
                      onBlur={handleBlur("name")}
                      placeholder="Jane Doe"
                      aria-invalid={Boolean(showError("name"))}
                      aria-describedby={showError("name") ? "name-error" : undefined}
                      className={cn(
                        "w-full h-12 pl-11 pr-4 rounded-xl bg-white border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all",
                        showError("name")
                          ? "border-rose-deep/60 focus:border-rose-deep"
                          : "border-cream-200"
                      )}
                    />
                  </div>
                  {showError("name") && (
                    <p id="name-error" className="mt-1.5 text-xs text-rose-deep">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={updateField("email")}
                      onBlur={handleBlur("email")}
                      placeholder="you@maisonflorelle.com"
                      aria-invalid={Boolean(showError("email"))}
                      aria-describedby={showError("email") ? "email-error" : undefined}
                      className={cn(
                        "w-full h-12 pl-11 pr-4 rounded-xl bg-white border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all",
                        showError("email")
                          ? "border-rose-deep/60 focus:border-rose-deep"
                          : "border-cream-200"
                      )}
                    />
                  </div>
                  {showError("email") && (
                    <p id="email-error" className="mt-1.5 text-xs text-rose-deep">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={updateField("phone")}
                      onBlur={handleBlur("phone")}
                      placeholder="0771234567"
                      aria-invalid={Boolean(showError("phone"))}
                      aria-describedby={showError("phone") ? "phone-error" : undefined}
                      className={cn(
                        "w-full h-12 pl-11 pr-4 rounded-xl bg-white border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all",
                        showError("phone")
                          ? "border-rose-deep/60 focus:border-rose-deep"
                          : "border-cream-200"
                      )}
                    />
                  </div>
                  {showError("phone") && (
                    <p id="phone-error" className="mt-1.5 text-xs text-rose-deep">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={values.password}
                      onChange={updateField("password")}
                      onBlur={handleBlur("password")}
                      placeholder="At least 8 characters"
                      aria-invalid={Boolean(showError("password"))}
                      aria-describedby={showError("password") ? "password-error" : "password-hint"}
                      className={cn(
                        "w-full h-12 pl-11 pr-11 rounded-xl bg-white border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all",
                        showError("password")
                          ? "border-rose-deep/60 focus:border-rose-deep"
                          : "border-cream-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                  {values.password && !showError("password") && (
                    <div id="password-hint" className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-cream-200 overflow-hidden">
                        <div
                          className={cn("h-full transition-all", passwordStrength.tone)}
                          style={{ width: `${Math.min(values.password.length * 8, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                  {showError("password") && (
                    <p id="password-error" className="mt-1.5 text-xs text-rose-deep">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-2 block"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      strokeWidth={1.8}
                    />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={values.confirmPassword}
                      onChange={updateField("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      placeholder="Re-enter your password"
                      aria-invalid={Boolean(showError("confirmPassword"))}
                      aria-describedby={showError("confirmPassword") ? "confirm-error" : undefined}
                      className={cn(
                        "w-full h-12 pl-11 pr-11 rounded-xl bg-white border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all",
                        showError("confirmPassword")
                          ? "border-rose-deep/60 focus:border-rose-deep"
                          : "border-cream-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                      ) : (
                        <Eye className="w-4 h-4" strokeWidth={1.8} />
                      )}
                    </button>
                  </div>
                  {showError("confirmPassword") && (
                    <p id="confirm-error" className="mt-1.5 text-xs text-rose-deep">
                      {errors.confirmPassword}
                    </p>
                  )}
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
                      Creating account
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowUpRight
                        className="w-4 h-4 group-hover:rotate-45 transition-transform"
                        strokeWidth={2}
                      />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
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

export default Register;
