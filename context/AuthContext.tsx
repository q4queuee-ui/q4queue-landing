"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { config } from "@/lib/config";
import {
  setToken,
  removeToken,
  isAuthenticated as checkAuth,
  getCurrentUser,
  decodeToken,
} from "@/lib/auth";
import type { JwtPayload, LoginRequest } from "@/types/api";

interface AuthContextType {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: JwtPayload | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<JwtPayload | null>(null);

  const syncAuthState = useCallback(() => {
    const authed = checkAuth();
    setIsAuthed(authed);
    setUser(authed ? getCurrentUser() : null);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      syncAuthState();
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [syncAuthState]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.login(credentials);
        setToken(response.access_token);
        syncAuthState();

        const currentUser = decodeToken(response.access_token);

        let targetPath = "/dashboard";
        if (response.force_password_change) {
          if (currentUser?.role === "organization_admin") {
            targetPath = "/organization-admin/change-password";
          } else if (currentUser?.role === "super_admin") {
            targetPath = "/super-admin/change-password";
          } else {
            targetPath = `/${currentUser?.org_slug}/change-password`;
          }
        } else if (currentUser?.role === "organization_admin") {
          targetPath = "/organization-admin";
        } else if (currentUser?.role === "super_admin") {
          targetPath = "/super-admin";
        } else if (currentUser?.org_slug) {
          targetPath = `/${currentUser.org_slug}/dashboard`;
        }

        // Cross-domain token transfer to the dashboard app
        const appBase = config.appUrl.replace(/\/$/, "");
        const targetUrl = `${appBase}${targetPath}#token=${encodeURIComponent(response.access_token)}`;

        if (typeof window !== "undefined") {
          window.location.href = targetUrl;
        } else {
          router.push(targetPath);
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.detail);
        } else {
          setError("Network error. Please check your connection.");
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [router, syncAuthState]
  );

  const logout = useCallback(() => {
    removeToken();
    syncAuthState();
  }, [syncAuthState]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthed,
        isHydrated,
        user,
        login,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
