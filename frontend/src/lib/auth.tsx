import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { mockLogin, mockMe } from "./mock-auth";
import type { AuthResponse, User } from "../types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: Record<string, unknown>) => Promise<User>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  setAuth: (response: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACCESS_KEY = "atmu_access_token";
const REFRESH_KEY = "atmu_refresh_token";
const USER_KEY = "atmu_user";

function persistAuth(response: AuthResponse) {
  localStorage.setItem(ACCESS_KEY, response.access_token);
  localStorage.setItem(REFRESH_KEY, response.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(response.user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(ACCESS_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem(REFRESH_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    // mock token bo'lsa API ga bormaydi
    if (accessToken.startsWith("mock_token_")) {
      try {
        const nextUser = mockMe(accessToken);
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      } catch {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    api.me(accessToken)
      .then((nextUser) => {
        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      })
      .catch(() => {
        localStorage.removeItem(ACCESS_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    accessToken,
    refreshToken,
    loading,
    async login(email, password) {
      let response: AuthResponse;
      try {
        response = await api.login(email, password);
      } catch {
        response = mockLogin(email, password);
      }
      persistAuth(response);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      setUser(response.user);
      return response.user;
    },
    async register(payload) {
      const response = await api.register(payload);
      persistAuth(response);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      setUser(response.user);
      return response.user;
    },
    logout() {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(REFRESH_KEY);
      localStorage.removeItem(USER_KEY);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    },
    async refreshProfile() {
      if (!accessToken) return;
      const nextUser = await api.me(accessToken);
      setUser(nextUser);
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    },
    setAuth(response) {
      persistAuth(response);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      setUser(response.user);
    }
  }), [accessToken, loading, refreshToken, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

