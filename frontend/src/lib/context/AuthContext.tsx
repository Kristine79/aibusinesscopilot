import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

interface User {
  id: number;
  name: string;
  email: string;
  telegram_username: string | null;
  is_verified: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  ACCESS: "abc_access_token",
  REFRESH: "abc_refresh_token",
} as const;

const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    accessToken: localStorage.getItem(STORAGE_KEYS.ACCESS),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH),
    isLoading: true,
  }));

  const setTokens = useCallback((access: string | null, refresh: string | null) => {
    setState((prev) => ({ ...prev, accessToken: access, refreshToken: refresh }));
    if (access) {
      localStorage.setItem(STORAGE_KEYS.ACCESS, access);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS);
    }
    if (refresh) {
      localStorage.setItem(STORAGE_KEYS.REFRESH, refresh);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REFRESH);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    const refreshToken = state.refreshToken;
    if (!refreshToken) {
      setState((prev) => ({ ...prev, user: null, isLoading: false }));
      return;
    }
    try {
      const data = await apiRequest<{ access_token: string; refresh_token: string }>(
        "/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refresh_token: refreshToken }),
        },
      );
      setTokens(data.access_token, data.refresh_token);
      const user = await apiRequest<User>("/auth/me", {}, data.access_token);
      setState((prev) => ({ ...prev, user, isLoading: false }));
    } catch {
      setTokens(null, null);
      setState((prev) => ({ ...prev, user: null, isLoading: false }));
    }
  }, [state.refreshToken, setTokens]);

  useEffect(() => {
    if (state.accessToken) {
      refreshAuth();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<{ access_token: string; refresh_token: string }>(
      "/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    );
    setTokens(data.access_token, data.refresh_token);
    const user = await apiRequest<User>("/auth/me", {}, data.access_token);
    setState((prev) => ({ ...prev, user }));
    trackEvent("login_completed");
  }, [setTokens]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await apiRequest<{ access_token: string; refresh_token: string }>(
      "/auth/register",
      { method: "POST", body: JSON.stringify({ name, email, password }) },
    );
    setTokens(data.access_token, data.refresh_token);
    const user = await apiRequest<User>("/auth/me", {}, data.access_token);
    setState((prev) => ({ ...prev, user }));
    trackEvent("signup_completed");
  }, [setTokens]);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" }, state.accessToken);
    } catch {
      // ignore logout errors
    }
    setTokens(null, null);
    setState((prev) => ({ ...prev, user: null }));
  }, [state.accessToken, setTokens]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthenticatedApi() {
  const { accessToken } = useAuth();
  const authFetch = useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      return apiRequest<T>(path, options, accessToken);
    },
    [accessToken],
  );
  return authFetch;
}
