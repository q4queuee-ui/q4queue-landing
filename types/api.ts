/**
 * types/api.ts
 * API types for authentication and public services in Q4Queue Landing.
 */

export interface LoginRequest {
  email: string;
  password: string;
  organization_slug?: string;
  login_type?: "staff" | "org_admin";
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  force_password_change?: boolean;
}

export interface JwtPayload {
  sub: string; // user_id
  org_id: string | null;
  org_slug: string | null;
  org_name: string | null;
  org_logo_url: string | null;
  role: string;
  is_first_login?: boolean;
  exp: number; // UNIX timestamp
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface ApiErrorResponse {
  status: number;
  detail: string;
  retryAfter?: number;
}
