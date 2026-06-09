import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Package,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  Image as ImageIcon,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";
import MotionSection from "@/components/luxury/MotionSection";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const stats = [
    { label: "Total products", value: data?.totalProducts, icon: Package },
    { label: "Active orders", value: data?.totalActiveOrders, icon: ShoppingBag },
    { label: "Customers", value: data?.totalCustomers, icon: Users },
    { label: "Revenue", value: data?.totalRevenue ? `Rs. ${data.totalRevenue}` : "—", icon: DollarSign },
  ];

  return (
    <AdminLayout>
      <section className="relative">
        <GradientOrbs variant="subtle" />
        <div className="relative">
          <MotionSection>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
                    Admin
                  </span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
                </div>
                <h1 className="font-display text-4xl sm:text-5xl font-medium text-foreground leading-[0.96] tracking-[-0.025em]">
                  Welcome,{" "}
                  <span className="italic font-serif gradient-text-gold">
                    {user?.name?.split(" ")[0] ?? "Admin"}
                  </span>
                </h1>
                <p className="mt-3 text-muted-foreground">A snapshot of the atelier today</p>
              </div>
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-cream-200 shadow-soft">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80">
                  Live
                </span>
              </div>
            </div>
          </MotionSection>

          {isLoading ? (
            <div className="py-20 flex items-center justify-center">
              <LuxurySpinner size={36} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden h-full bg-white border border-cream-200/80 shadow-soft">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(74,29,107,0.1), rgba(244,194,194,0.18))",
                            border: "1px solid rgba(74, 29, 107, 0.15)",
                          }}
                        >
                          <stat.icon className="w-4 h-4 text-primary" strokeWidth={1.8} />
                        </div>
                        <ArrowUpRight
                          className="w-4 h-4 text-muted-foreground/40 group-hover:text-foreground group-hover:rotate-45 transition-all"
                          strokeWidth={1.8}
                        />
                      </div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground mb-1.5">
                        {stat.label}
                      </p>
                      <p className="font-display text-2xl sm:text-3xl font-medium text-foreground tracking-tight">
                        {stat.value ?? "—"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="sm:col-span-2 lg:col-span-4 mt-2 grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="rounded-2xl bg-white border border-cream-200/80 shadow-soft p-5 sm:p-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(74,29,107,0.1), rgba(244,194,194,0.18))",
                        border: "1px solid rgba(74, 29, 107, 0.15)",
                      }}
                    >
                      <ImageIcon className="w-4 h-4 text-primary" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                        Quick links
                      </p>
                      <p className="font-display text-lg text-foreground">Manage the atelier</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Use the side navigation to manage products, orders, customers, and custom bouquets.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
