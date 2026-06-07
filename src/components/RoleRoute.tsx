import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminRole, type UserRole } from "@/types/auth";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

interface RoleRouteProps {
  allow: UserRole | UserRole[];
}

/**
 * Wraps a route tree so it can only be reached by users whose role matches
 * the `allow` list.
 *
 * - While auth is bootstrapping, show a spinner.
 * - Unauthenticated users go to /login (with `from` preserved).
 * - Authenticated users with a different role are redirected to a sensible
 *   landing page: admins (admin/superadmin) go to /admin, customers to their orders.
 */
const RoleRoute = ({ allow }: RoleRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin, isCustomer, role } = useAuth();
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

  const allowed = Array.isArray(allow) ? allow : [allow];
  const allowedAdmins = allowed.some((r) => isAdminRole(r));

  const matches =
    (isAdmin && allowed.some((r) => isAdminRole(r))) ||
    (isCustomer && allowed.includes("customer")) ||
    (role !== null && allowed.includes(role));

  if (!matches) {
    const fallback = isAdmin
      ? "/admin"
      : isCustomer
        ? "/account/orders"
        : "/";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
