import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  login as apiLogin,
  signup as apiSignup,
  logout as apiLogout,
  getMe,
} from "../services/authService";
import { api } from "../services/apiClient";
import { notifyError, notifySuccess } from "../utils/toast";

// Token management functions
const getStoredToken = () => localStorage.getItem('authToken');
const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user if token present in localStorage
  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = getStoredToken();
      if (token) {
        try {
          // Set the token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Verify token is still valid
          const res = await getMe();
          const u = res?.data?.user || res?.data?.data?.user || res?.data?.data; // shapes
          if (mounted) setUser(u || null);
        } catch (_err) {
          // Token is invalid, clear it
          if (mounted) {
            setStoredToken(null);
            setUser(null);
          }
        }
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLogin({ email, password });
      const u = res?.data?.user || res?.data?.data?.user || res?.data?.data;
      const token = res?.token;
      
      setUser(u);
      if (token) {
        setStoredToken(token);
      }
      notifySuccess("Logged in");
      return u;
    } catch (err) {
      notifyError(err.message || "Login failed");
      throw err;
    }
  }, []);

  const signup = useCallback(async (name, email, password, passwordConfirm) => {
    try {
      const res = await apiSignup({ name, email, password, passwordConfirm });
      const u = res?.data?.user || res?.data?.data?.user || res?.data?.data;
      const token = res?.token;
      
      setUser(u);
      if (token) {
        setStoredToken(token);
      }
      notifySuccess("Account created");
      return u;
    } catch (err) {
      notifyError(err.message || "Signup failed");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (_err) {
      /* ignore */
    }
    setUser(null);
    setStoredToken(null); // Clear token from localStorage and headers
    notifySuccess("Logged out");
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
