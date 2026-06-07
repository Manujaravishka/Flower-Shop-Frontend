import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Gift,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Customers", icon: Users },
  { to: "/admin/gifts", label: "Custom bouquets", icon: Gift },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 sm:pt-28">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-10 pb-12">
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="rounded-2xl border border-cream-200/80 bg-white shadow-soft p-4">
                <div className="px-2 py-3 mb-2 border-b border-cream-200/70">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
                    Signed in
                  </p>
                  <p className="mt-1 font-display text-base text-foreground truncate">
                    {user?.name ?? "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-soft"
                            : "text-foreground/75 hover:bg-cream-100 hover:text-foreground"
                        )
                      }
                    >
                      <item.icon className="w-4 h-4" strokeWidth={1.8} />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-3 pt-3 border-t border-cream-200/70">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/75 hover:bg-cream-100 hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.8} />
                    Sign out
                  </button>
                </div>
              </div>
            </aside>

            <main className="min-w-0">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
