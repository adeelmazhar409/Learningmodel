import axios, { AxiosError, type AxiosRequestConfig } from "axios";

/* ─────────────────────────────────────────────────────────
   MOCK MODE
   When NEXT_PUBLIC_API_URL is not set (or you pass
   ?mock=true in the URL) all API calls return mock data
   so the frontend works completely without the backend.
───────────────────────────────────────────────────────── */
export const IS_MOCK =
  typeof window !== "undefined"
    ? !process.env.NEXT_PUBLIC_API_URL ||
      new URLSearchParams(window.location.search).get("mock") === "true"
    : !process.env.NEXT_PUBLIC_API_URL;

/* ── Axios instance ── */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
});

/* ── Attach auth token from localStorage on every request ── */
apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  try {
    const raw = localStorage.getItem("neuropath-auth");
    if (raw) {
      const parsed = JSON.parse(raw) as { state?: { session?: { access_token?: string } } };
      const token  = parsed?.state?.session?.access_token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // silently ignore JSON parse errors
  }
  return config;
});

/* ── Normalise error responses ── */
apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string }>) => {
    const message =
      err.response?.data?.message ??
      err.message ??
      "Something went wrong. Please try again.";

    // 401 — clear local session so auth guard redirects to login
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("neuropath-auth");
      window.location.replace("/login");
    }

    return Promise.reject(new Error(message));
  }
);

/* ── Helper so individual API files can skip the real call ── */
export async function callOrMock<T>(
  realCall: () => Promise<T>,
  mockData: T,
  delayMs  = 600
): Promise<T> {
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, delayMs));
    return mockData;
  }
  return realCall();
}

/* ── Typed convenience wrappers ── */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.get<T>(url, config);
  return res.data;
}

export async function post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.post<T>(url, data, config);
  return res.data;
}

export async function patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.patch<T>(url, data, config);
  return res.data;
}

export async function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const res = await apiClient.delete<T>(url, config);
  return res.data;
}
