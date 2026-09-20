import { config } from "@/lib/config";
import { getToken } from "@/lib/auth";
import type { LoginRequest, TokenResponse, ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  detail: string;
  retryAfter?: number;

  constructor(resp: ApiErrorResponse) {
    super(resp.detail);
    this.name = "ApiError";
    this.status = resp.status;
    this.detail = resp.detail;
    this.retryAfter = resp.retryAfter;
  }
}

function friendlyMessage(status: number, rawDetail: string): string {
  switch (status) {
    case 400: return rawDetail || "Invalid request. Please try again.";
    case 401:
      if (rawDetail === "Invalid credentials" || rawDetail.includes("deactivated")) {
        return rawDetail;
      }
      return "Session expired. Please sign in again.";
    case 403: return rawDetail || "Access denied. You don't have permission for this action.";
    case 404: return rawDetail || "The requested resource was not found.";
    case 409: return rawDetail || "This action conflicts with the current state.";
    case 422: return rawDetail || "Invalid input. Please check your data.";
    case 429: return rawDetail || "Too many requests. Please slow down.";
    case 500: return rawDetail || "A temporary server issue occurred. Please try again.";
    case 502:
    case 503: return "The service is temporarily unavailable. Please try again shortly.";
    default: return rawDetail || "An unexpected error occurred.";
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.apiBaseUrl}${path}`;
  const headers = new Headers(options.headers);

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let resp: Response;
  try {
    resp = await fetch(url, { ...options, headers });
  } catch {
    throw new ApiError({
      status: 0,
      detail: "Unable to connect to server. Please check your network.",
    });
  }

  if (!resp.ok) {
    let rawDetail = "An unexpected error occurred";
    try {
      const body = await resp.json();
      if (Array.isArray(body.detail)) {
        rawDetail = body.detail.map((e: { msg?: string }) => e.msg || "").join("; ");
      } else if (typeof body.detail === "string") {
        rawDetail = body.detail;
      } else if (body.message) {
        rawDetail = body.message;
      }
    } catch {
      // Use fallback
    }

    throw new ApiError({
      status: resp.status,
      detail: friendlyMessage(resp.status, rawDetail),
    });
  }

  return resp.json();
}

export interface CustomPlanRequestData {
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company_name: string;
  business_category: string;
  branch_count: string;
  queue_count: string;
  staff_count: string;
  visitor_volume: string;
  selected_services: string[];
  special_notes?: string;
}

export const api = {
  login(data: LoginRequest): Promise<TokenResponse> {
    return request<TokenResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  requestForgotPasswordOtp(data: { email: string; organization_slug?: string }): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/forgot-password-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPasswordWithOtp(data: {
    email: string;
    otp: string;
    new_password: string;
    organization_slug?: string;
  }): Promise<{ message: string }> {
    return request<{ message: string }>("/auth/reset-password-with-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submitContactSales(data: { contact_phone?: string; message?: string }): Promise<{ message: string }> {
    return request<{ message: string }>("/subscriptions/public/contact-sales", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submitExpiredTrialContactSales(data: {
    email: string;
    organization_slug?: string;
    password: string;
    contact_phone?: string;
    message?: string;
  }): Promise<{ message: string }> {
    return request<{ message: string }>("/subscriptions/contact-sales/expired", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  submitPublicCustomPlanRequest(data: CustomPlanRequestData): Promise<{ message: string; id: string }> {
    return request<{ message: string; id: string }>("/subscriptions/public/custom-plan-request", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
