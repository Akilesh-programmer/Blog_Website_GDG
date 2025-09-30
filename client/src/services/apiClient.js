import axios from "axios";

// Determine base URL: prefer Vite env (import.meta.env), fallback to window location heuristics.
const baseURL = (() => {
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL
  ) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3000/api/v1`;
  }
  return "http://localhost:3000/api/v1";
})();

export const api = axios.create({
  baseURL,
  withCredentials: false, // Use Bearer tokens instead of cookies for better Vercel compatibility
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Set up token from localStorage on initialization
const token = localStorage.getItem("authToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

if (
  typeof import.meta !== "undefined" &&
  import.meta.env &&
  import.meta.env.DEV
) {
  console.log("[apiClient] Using API base URL:", baseURL);
}

// Response interceptor to unwrap data and standardize errors
api.interceptors.response.use(
  (response) => {
    return response.data; // controllers already wrap results; can adjust if needed
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const message = (data && (data.message || data.error)) || error.message;
      return Promise.reject({ status, message, data });
    }
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: "Network error or no response from server",
      });
    }
    return Promise.reject({
      status: 0,
      message: error.message || "Unknown error",
    });
  }
);

export const setAuthHeader = (token) => {
  // For future use if we add a non-httpOnly token (e.g., for websockets). Currently cookie-based.
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
};

export default api;
