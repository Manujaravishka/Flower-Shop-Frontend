import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authService } from "@/services/authService";
import {
  isAdminRole,
  type AuthUser,
  type RegisterPayload,
  type UpdateProfilePayload,
  type UserRole,
} from "@/types/auth";
import { extractApiErrorMessage } from "@/lib/apiError";

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: AuthUser; error?: string }>;
  register: (
    payload: RegisterPayload
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    data: UpdateProfilePayload
  ) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const DEFAULT_ROLE: UserRole = "customer";

function resolveRole(user: AuthUser | null): UserRole | null {
  if (!user) return null;
  return user.role ?? DEFAULT_ROLE;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async (): Promise<void> => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      setUser(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (token) {
        try {
          const profile = await authService.getProfile();
          if (!cancelled) setUser(profile);
        } catch (error) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          if (!cancelled) setUser(null);
        }
      }
      if (!cancelled) setIsLoading(false);
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      const profile = await authService.getProfile();
      setUser(profile);
      return { success: true, user: profile };
    } catch (error) {
      return { success: false, error: extractApiErrorMessage(error, "Login failed") };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      await authService.register(payload);
      try {
        await authService.login({ email: payload.email, password: payload.password });
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (loginError) {
        console.error("[AuthContext] Auto-login after registration failed:", loginError);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: extractApiErrorMessage(error, "Registration failed"),
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    setUser(null);
  };

  const updateProfile = async (data: UpdateProfilePayload) => {
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: extractApiErrorMessage(error, "Update failed"),
      };
    }
  };

  const role = resolveRole(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: isAdminRole(role),
        isCustomer: role === "customer",
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
