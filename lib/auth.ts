/**
 * lib/auth.ts
 * Authentication token management for Q4Queue.
 */

import type { JwtPayload } from "@/types/api";

export type TokenType = "staff" | "org_admin" | "super_admin";

const STORAGE_KEYS: Record<TokenType, string> = {
  staff: "fc_access_token",
  org_admin: "fc_org_access_token",
  super_admin: "fc_sa_access_token",
};

const _tokens: Record<TokenType, string | null> = {
  staff: null,
  org_admin: null,
  super_admin: null,
};

export function getTokenTypeFromPath(): TokenType {
  if (typeof window === "undefined") return "staff";
  const path = window.location.pathname;
  if (path.startsWith("/super-admin")) return "super_admin";
  if (path.startsWith("/organization-admin") || path.startsWith("/org-admin") || path === "/organization-login") return "org_admin";
  return "staff";
}

export function setToken(token: string, explicitType?: TokenType): void {
  let type = explicitType;
  if (!type) {
    const payload = decodeToken(token);
    if (payload) {
      if (payload.role === "super_admin") type = "super_admin";
      else if (payload.role === "organization_admin") type = "org_admin";
      else type = "staff";
    } else {
      type = getTokenTypeFromPath();
    }
  }

  const finalType = type as TokenType;
  _tokens[finalType] = token;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(STORAGE_KEYS[finalType], token);
  }
}

export function getToken(explicitType?: TokenType): string | null {
  const type = explicitType || getTokenTypeFromPath();
  if (_tokens[type]) return _tokens[type];

  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem(STORAGE_KEYS[type]);
    if (stored) {
      _tokens[type] = stored;
      return stored;
    }
  }
  return null;
}

export function removeToken(explicitType?: TokenType): void {
  const type = explicitType || getTokenTypeFromPath();
  _tokens[type] = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEYS[type]);
  }
}

export function setSuperAdminToken(token: string): void {
  setToken(token, "super_admin");
}

export function getSuperAdminToken(): string | null {
  return getToken("super_admin");
}

export function removeSuperAdminToken(): void {
  removeToken("super_admin");
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1])) as JwtPayload;

    if (!payload.sub || !payload.role || !payload.exp || payload.org_id === undefined || !payload.email) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  const payload = decodeToken(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now + 30) {
    removeToken();
    return false;
  }
  return true;
}

export function getCurrentUser(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;
  return decodeToken(token);
}
