import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { orderApi, customerApi, paymentApi, unwrapData } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ClientNavbar from "@/components/ClientNavbar";
import Footer from "@/components/Footer";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import MotionSection from "@/components/luxury/MotionSection";
import GlassCard from "@/components/luxury/GlassCard";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import { cn } from "@/lib/utils";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  const paymentMethods = [
    {
      id: "CASH",
      label: "Cash on delivery",
      icon: Banknote,
      description: "Pay when your arrangement arrives",
    },
    {
      id: "CARD",
      label: "Credit / debit card",
      icon: CreditCard,
      description: "Secure encrypted card payment",
    },
    {
      id: "BANK",
      label: "Bank transfer",
      icon: Smartphone,
      description: "Direct transfer to our account",
    },
  ];

  const handleSubmit = async () => {
    if (
      !customerData.name ||
      !customerData.email ||
      !customerData.phone ||
      !customerData.address
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (!isAuthenticated) {
        const customerResponse = await customerApi.create(customerData);
        const customerPayload = unwrapData<{ _id?: string }>(customerResponse);
        if (!customerPayload._id) {
          throw new Error("Failed to create customer");
        }
        await refreshUser();
      }

      const orderResponse = await orderApi.create({
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalPrice,
        shippingAddress: customerData.address,
      });

      const orderPayload = unwrapData<{ _id?: string }>(orderResponse);
      const orderId = orderPayload?._id;
      if (!orderId) {
        throw new Error("Failed to create order");
      }

      await paymentApi.process({
        orderId,
        amount: totalPrice,
        discount: 0,
        paymentMethod,
      });

      clearCart();
      toast.success("Order placed successfully");
      navigate("/order-success");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ClientNavbar />
      <main className="pt-28 sm:pt-32 pb-16 sm:pb-24">
        <section className="relative">
          <GradientOrbs variant="subtle" />
          <div className="container mx-auto px-4 lg:px-6 relative">
            <MotionSection>
              <button
                onClick={() => navigate("/cart")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
              >
                <ArrowLeft
                  className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
                  strokeWidth={1.8}
                />
                Back to bag
              </button>
              <div className="inline-flex items-center gap-2 mb-5">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                  Checkout
                </span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h1 className="font-display text-5xl sm:text-6xl font-medium text-foreground leading-[0.96] tracking-[-0.025em]">
                Complete your{" "}
                <span className="italic font-serif gradient-text-gold">order</span>
              </h1>
            </MotionSection>

            {/* Step indicator */}
            <MotionSection delay={0.1}>
              <div className="mt-10 flex items-center gap-3 sm:gap-4 max-w-md">
                {[
                  { num: 1, label: "Delivery" },
                  { num: 2, label: "Payment" },
                ].map((s, i) => (
                  <div
                    key={s.num}
                    className="flex items-center gap-3 sm:gap-4 flex-1"
                  >
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all shadow-soft",
                          step >= s.num
                            ? "text-primary-foreground"
                            : "bg-white border border-cream-200 text-muted-foreground"
                        )}
                        style={
                          step >= s.num
                            ? {
                                background:
                                  "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                              }
                            : undefined
                        }
                      >
                        {step > s.num ? (
                          <Check className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                          s.num
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors hidden sm:block",
                          step >= s.num
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i === 0 && (
                      <div
                        className={cn(
                          "flex-1 h-px transition-colors",
                          step > 1 ? "bg-primary" : "bg-cream-200"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </MotionSection>

            <div className="mt-12 grid lg:grid-cols-3 gap-6 lg:gap-10">
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Delivery */}
                <MotionSection delay={0.15}>
                  <div
                    className={cn(
                      "rounded-2xl overflow-hidden transition-all bg-white border border-cream-200/80 shadow-soft",
                      step === 1 && "ring-1 ring-primary/30"
                    )}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                            step >= 1
                              ? "text-primary-foreground"
                              : "bg-cream-100 text-muted-foreground"
                          )}
                          style={
                            step >= 1
                              ? {
                                  background:
                                    "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                                }
                              : undefined
                          }
                        >
                          {step > 1 ? (
                            <Check className="w-4 h-4" strokeWidth={2.5} />
                          ) : (
                            "1"
                          )}
                        </div>
                        <h2 className="font-display text-xl font-medium text-foreground">
                          Delivery details
                        </h2>
                      </div>

                      {step === 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-4"
                        >
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                                Full name
                              </label>
                              <input
                                value={customerData.name}
                                onChange={(e) =>
                                  setCustomerData({
                                    ...customerData,
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Your name"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                                Phone
                              </label>
                              <input
                                value={customerData.phone}
                                onChange={(e) =>
                                  setCustomerData({
                                    ...customerData,
                                    phone: e.target.value,
                                  })
                                }
                                placeholder="07X XXX XXXX"
                                className="w-full h-12 px-4 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                              Email
                            </label>
                            <input
                              type="email"
                              value={customerData.email}
                              onChange={(e) =>
                                setCustomerData({
                                  ...customerData,
                                  email: e.target.value,
                                })
                              }
                              placeholder="your@email.com"
                              className="w-full h-12 px-4 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2 block">
                              Delivery address
                            </label>
                            <textarea
                              value={customerData.address}
                              onChange={(e) =>
                                setCustomerData({
                                  ...customerData,
                                  address: e.target.value,
                                })
                              }
                              placeholder="Full street address, city"
                              rows={3}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-cream-200 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:shadow-soft transition-all resize-none"
                            />
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setStep(2)}
                            disabled={
                              !customerData.name ||
                              !customerData.email ||
                              !customerData.phone ||
                              !customerData.address
                            }
                            className="group inline-flex items-center gap-2 h-12 px-6 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none"
                            style={{
                              background:
                                "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                            }}
                          >
                            Continue to payment
                            <ArrowUpRight
                              className="w-4 h-4 group-hover:rotate-45 transition-transform"
                              strokeWidth={2}
                            />
                          </motion.button>
                        </motion.div>
                      )}

                      {step > 1 && (
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <p className="font-medium text-foreground">
                              {customerData.name}
                            </p>
                            <p className="text-muted-foreground text-xs mt-0.5">
                              {customerData.phone} · {customerData.email}
                            </p>
                          </div>
                          <button
                            onClick={() => setStep(1)}
                            className="text-xs font-medium text-primary hover:text-gold transition-colors uppercase tracking-[0.2em]"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </MotionSection>

                {/* Step 2: Payment */}
                <MotionSection delay={0.2}>
                  <div
                    className={cn(
                      "rounded-2xl overflow-hidden transition-all bg-white border border-cream-200/80 shadow-soft",
                      step === 2 && "ring-1 ring-primary/30"
                    )}
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div
                          className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                            step >= 2
                              ? "text-primary-foreground"
                              : "bg-cream-100 text-muted-foreground"
                          )}
                          style={
                            step >= 2
                              ? {
                                  background:
                                    "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                                }
                              : undefined
                          }
                        >
                          2
                        </div>
                        <h2 className="font-display text-xl font-medium text-foreground">
                          Payment method
                        </h2>
                      </div>

                      {step === 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                          className="space-y-4"
                        >
                          <div className="space-y-3">
                            {paymentMethods.map((method) => {
                              const isSelected = paymentMethod === method.id;
                              return (
                                <button
                                  key={method.id}
                                  onClick={() => setPaymentMethod(method.id)}
                                  className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                                    isSelected
                                      ? "border-primary bg-primary/[0.05] shadow-soft"
                                      : "border-cream-200 bg-white hover:border-primary/30 hover:shadow-soft"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                                      isSelected
                                        ? "text-primary-foreground"
                                        : "bg-cream-100 text-muted-foreground"
                                    )}
                                    style={
                                      isSelected
                                        ? {
                                            background:
                                              "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                                          }
                                        : undefined
                                    }
                                  >
                                    <method.icon
                                      className="w-5 h-5"
                                      strokeWidth={1.6}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={cn(
                                        "text-sm font-medium transition-colors",
                                        isSelected
                                          ? "text-primary"
                                          : "text-foreground/90"
                                      )}
                                    >
                                      {method.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {method.description}
                                    </p>
                                  </div>
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                                      isSelected
                                        ? "border-primary"
                                        : "border-cream-200"
                                    )}
                                  >
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{
                                          background:
                                            "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                                        }}
                                      />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="group w-full h-13 rounded-full text-primary-foreground text-sm font-medium shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            style={{
                              background:
                                "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 50%, #C8A24A 130%)",
                            }}
                          >
                            {isLoading ? (
                              <>
                                <LuxurySpinner size={18} />
                                <span>Processing</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck
                                  className="w-4 h-4"
                                  strokeWidth={2}
                                />
                                Place order · Rs.{" "}
                                {totalPrice.toLocaleString()}
                              </>
                            )}
                          </motion.button>

                          <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground flex items-center justify-center gap-1.5">
                            <Lock className="w-3 h-3 text-primary" strokeWidth={2} />
                            Secured with end-to-end encryption
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </MotionSection>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <MotionSection delay={0.25}>
                  <div className="sticky top-28">
                    <div
                      className="relative rounded-3xl overflow-hidden bg-white border border-cream-200/80 shadow-card"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                      <div className="p-6 sm:p-7">
                        <h2 className="font-display text-xl font-medium text-foreground mb-5">
                          Your order
                        </h2>

                        <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1 -mr-1">
                          {items.map((item) => (
                            <div key={item._id} className="flex gap-3">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-cream-200 shadow-soft">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className="w-full h-full flex items-center justify-center"
                                    style={{
                                      background:
                                        "linear-gradient(135deg, #F4C2C2 0%, #C8A24A 100%)",
                                    }}
                                  >
                                    <span className="text-2xl opacity-60">
                                      🌸
                                    </span>
                                  </div>
                                )}
                                <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow-soft"
                                  style={{
                                    background:
                                      "linear-gradient(135deg, #4A1D6B 0%, #6B3D96 100%)",
                                  }}
                                >
                                  {item.quantity}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground text-sm truncate">
                                  {item.name}
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
                                  {item.colour}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-primary">
                                Rs.{" "}
                                {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="luxury-divider mb-4" />

                        <div className="space-y-3 mb-5">
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
                        </div>

                        <div className="luxury-divider mb-4" />

                        <div className="flex items-baseline justify-between">
                          <span className="font-display text-base font-medium">
                            Total
                          </span>
                          <span className="font-display text-2xl font-medium gradient-text-gold">
                            Rs. {totalPrice.toLocaleString()}
                          </span>
                        </div>

                        <div
                          className="mt-5 p-3.5 rounded-xl flex items-center gap-2.5"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(244, 194, 194, 0.18), rgba(200, 162, 74, 0.08))",
                            border: "1px solid rgba(74, 29, 107, 0.15)",
                          }}
                        >
                          <Truck
                            className="w-4 h-4 text-primary flex-shrink-0"
                            strokeWidth={1.8}
                          />
                          <p className="text-xs text-foreground/90">
                            Complimentary same-day delivery
                          </p>
                        </div>
                      </div>
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

export default Checkout;
