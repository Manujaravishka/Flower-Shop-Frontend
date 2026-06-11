import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import GradientOrbs from "@/components/luxury/GradientOrbs";
import LuxurySpinner from "@/components/luxury/LuxurySpinner";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      navigate("/login", { replace: true, state: { error } });
      return;
    }

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      refreshUser().then(() => {
        navigate("/account/orders", { replace: true });
      }).catch(() => {
        navigate("/login", { replace: true });
      });
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative flex items-center justify-center">
      <GradientOrbs variant="cinematic" />
      <div className="relative flex flex-col items-center gap-4">
        <LuxurySpinner size={32} />
        <p className="text-muted-foreground text-sm">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
