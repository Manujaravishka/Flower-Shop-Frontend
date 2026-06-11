import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

const GoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const redirectTo = searchParams.get("redirectTo") || "/account/orders";

    const safeRedirect = typeof redirectTo === "string" && redirectTo.startsWith("/") ? redirectTo : "/account/orders";

    if (!accessToken || !refreshToken) {
      toast.error("Google authentication failed. Please try again.");
      navigate("/login", { replace: true });
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    refreshUser()
      .then(() => {
        navigate(safeRedirect, { replace: true });
      })
      .catch((error) => {
        console.error("Google OAuth refresh failed:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        toast.error("Unable to restore your session after Google login.");
        navigate("/login", { replace: true });
      })
      .finally(() => setIsLoading(false));
  }, [refreshUser, navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="rounded-3xl bg-white border border-cream-200 px-8 py-14 shadow-card text-center max-w-md w-full">
        {isLoading ? (
          <>
            <p className="mb-6 text-lg font-medium text-foreground">Completing Google sign in...</p>
            <div className="flex justify-center">
              <LuxurySpinner size={32} />
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;
