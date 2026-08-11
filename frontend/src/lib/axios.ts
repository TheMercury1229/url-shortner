import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// ─── Paths Configuration ──────────────────────────────────────────────────────
export const paths = {
  LOGIN: "/api/auth/public/login",
  REGISTER: "/api/auth/public/register",
  SHORTEN: "/api/urls/shorten",
  MY_URLS: "/api/urls/myurls",
  ANALYTICS: "/api/urls/analytics",
  TOTAL_CLICKS: "/api/urls/totalClicks",
  DELETE_URL: "/api/urls",
} as const;

// Helper to get cookies safely on client-side
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

import { API_URL } from "./config";

// Create Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle Unauthorized
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          // Clear cookie and redirect to sign-in if unauthenticated
          document.cookie = "auth_token=; path=/; max-age=0";
          window.location.href = "/sign-in";
        }
      }
      return Promise.reject(error.response.data || error.message);
    }
    return Promise.reject(error.message);
  }
);

export default api;

// ─── API Helper Functions ─────────────────────────────────────────────────────

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface RegisterRequest {
  username?: string;
  email?: string;
  password?: string;
}

export interface JwtAuthenticationResponse {
  token: string;
}

export interface UrlMappingDTO {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
  username: string;
}

export interface ClickEventDTO {
  clickDate: string;
  count: number;
}

/**
 * Log in a user and retrieve a JWT authentication token.
 */
export async function loginUser(data: LoginRequest): Promise<JwtAuthenticationResponse> {
  const response = await api.post<JwtAuthenticationResponse>(paths.LOGIN, data);
  return response.data;
}

/**
 * Register a new user.
 */
export async function registerUser(data: RegisterRequest): Promise<string> {
  const response = await api.post<string>(paths.REGISTER, data);
  return response.data;
}

/**
 * Shorten an original URL.
 */
export async function shortenUrl(originalUrl: string): Promise<UrlMappingDTO> {
  const response = await api.post<UrlMappingDTO>(paths.SHORTEN, { originalUrl });
  return response.data;
}

/**
 * Get all URL mappings created by the authenticated user.
 */
export async function getMyUrls(): Promise<UrlMappingDTO[]> {
  const response = await api.get<UrlMappingDTO[]>(paths.MY_URLS);
  return response.data;
}

/**
 * Get analytics for a specific short URL between two dates.
 * Format for dates: ISO_LOCAL_DATE_TIME (e.g. YYYY-MM-DDTHH:mm:ss)
 */
export async function getUrlAnalytics(
  shortUrl: string,
  startDate: string,
  endDate: string
): Promise<ClickEventDTO[]> {
  const response = await api.get<ClickEventDTO[]>(`${paths.ANALYTICS}/${shortUrl}`, {
    params: { startDate, endDate },
  });
  return response.data;
}

/**
 * Get total clicks aggregated by date for the authenticated user between two dates.
 * Format for dates: ISO_LOCAL_DATE (e.g. YYYY-MM-DD)
 */
export async function getTotalClicksByDate(
  startDate: string,
  endDate: string
): Promise<Record<string, number>> {
  const response = await api.get<Record<string, number>>(paths.TOTAL_CLICKS, {
    params: { startDate, endDate },
  });
  return response.data;
}

/**
 * Delete a shortened URL by ID.
 */
export async function deleteUrl(id: number): Promise<void> {
  await api.delete(`${paths.DELETE_URL}/${id}`);
}
