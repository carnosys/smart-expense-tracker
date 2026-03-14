import type { PropsWithChildren } from "react";
import { createContext, useEffect, useMemo, useState } from "react";

import { getProfile, login as loginRequest, register as registerRequest } from "../../api/auth";
import {
  clearStoredAccessToken,
  getStoredAccessToken,
  setStoredAccessToken,
} from "../../lib/storage";
import type { LoginPayload, RegisterPayload, UserProfile } from "../../types/auth";

type AuthStatus = "bootstrapping" | "ready";

type AuthContextValue = {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("bootstrapping");

  useEffect(() => {
    const storedToken = getStoredAccessToken();

    if (!storedToken) {
      setStatus("ready");
      return;
    }

    const initialToken = storedToken;
    let cancelled = false;

    async function bootstrap() {
      try {
        const profile = await getProfile(initialToken);
        if (!cancelled) {
          setToken(initialToken);
          setUser(profile);
        }
      } catch {
        clearStoredAccessToken();
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setStatus("ready");
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  async function login(payload: LoginPayload) {
    const response = await loginRequest(payload);
    const nextToken = response.access_token;
    setStoredAccessToken(nextToken);
    const profile = await getProfile(nextToken);
    setToken(nextToken);
    setUser(profile);
    setStatus("ready");
  }

  async function register(payload: RegisterPayload) {
    await registerRequest(payload);
    await login({ email: payload.email, password: payload.password });
  }

  function logout() {
    clearStoredAccessToken();
    setToken(null);
    setUser(null);
    setStatus("ready");
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping: status === "bootstrapping",
      login,
      register,
      logout,
    }),
    [status, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
