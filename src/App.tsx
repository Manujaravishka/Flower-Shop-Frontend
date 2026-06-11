import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleRoute from "@/components/RoleRoute";
import WhatsAppButton from "@/components/WhatsAppButton";
import AdminLayout from "@/layouts/AdminLayout";
import AccountLayout from "@/layouts/AccountLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerification from "./pages/OtpVerification";
import GoogleCallback from "./pages/GoogleCallback";
import GoogleOAuthCallback from "./pages/GoogleOAuthCallback";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Gallery from "./pages/Gallery";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Customize from "./pages/Customize";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AccountHome from "./pages/account/AccountHome";
import AccountProfile from "./pages/account/AccountProfile";
import AccountOrders from "./pages/account/AccountOrders";
import AccountOrderDetail from "./pages/account/AccountOrderDetail";
import AccountAddresses from "./pages/account/AccountAddresses";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminGifts from "./pages/admin/AdminGifts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <WhatsAppButton />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/oauth/google/callback" element={<GoogleOAuthCallback />} />
              <Route path="/oauth/callback" element={<GoogleCallback />} />
              <Route path="/verify-otp" element={<OtpVerification />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/customize" element={<Customize />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />

              {/* Legacy redirects (kept for backward compatibility) */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />

              {/* Customer account — auth required, both roles allowed */}
              <Route element={<ProtectedRoute />}>
                <Route
                  path="/account"
                  element={
                    <AccountLayout>
                      <AccountHome />
                    </AccountLayout>
                  }
                />
                <Route
                  path="/account/profile"
                  element={
                    <AccountLayout>
                      <AccountProfile />
                    </AccountLayout>
                  }
                />
                <Route
                  path="/account/orders"
                  element={
                    <AccountLayout>
                      <AccountOrders />
                    </AccountLayout>
                  }
                />
                <Route
                  path="/account/orders/:id"
                  element={
                    <AccountLayout>
                      <AccountOrderDetail />
                    </AccountLayout>
                  }
                />
                <Route
                  path="/account/addresses"
                  element={
                    <AccountLayout>
                      <AccountAddresses />
                    </AccountLayout>
                  }
                />
              </Route>

              {/* Admin console — admin only */}
              <Route element={<RoleRoute allow="admin" />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/gifts" element={<AdminGifts />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
