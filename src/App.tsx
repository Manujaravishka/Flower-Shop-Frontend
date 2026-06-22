import { lazy, Suspense } from "react";
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
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const OtpVerification = lazy(() => import("./pages/OtpVerification"));
const GoogleCallback = lazy(() => import("./pages/GoogleCallback"));
const GoogleOAuthCallback = lazy(() => import("./pages/GoogleOAuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Categories = lazy(() => import("./pages/Categories"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Customize = lazy(() => import("./pages/Customize"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AccountHome = lazy(() => import("./pages/account/AccountHome"));
const AccountProfile = lazy(() => import("./pages/account/AccountProfile"));
const AccountOrders = lazy(() => import("./pages/account/AccountOrders"));
const AccountOrderDetail = lazy(() => import("./pages/account/AccountOrderDetail"));
const AccountAddresses = lazy(() => import("./pages/account/AccountAddresses"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/AdminOrderDetail"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminGifts = lazy(() => import("./pages/admin/AdminGifts"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LuxurySpinner size={40} />
  </div>
);

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
            <Suspense fallback={<PageLoader />}>
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

                {/* Legacy redirects */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />

                {/* Customer account — auth required */}
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
