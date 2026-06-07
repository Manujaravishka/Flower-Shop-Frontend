import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

/**
 * Wraps a route tree so it can only be reached by an authenticated user.
 *
 * - While the auth bootstrap is running, render a centered spinner.
 * - Unauthenticated users are redirected to /login, with the current
 *   location stored in `state.from` so it can be restored after login.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LuxurySpinner size={40} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
