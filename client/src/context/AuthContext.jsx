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
import { notifyError, notifySuccess } from "../utils/toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current user if session cookie present
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getMe();
        const u = res?.data?.user || res?.data?.data?.user || res?.data?.data; // shapes
        if (mounted) setUser(u || null);
      } catch (_err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await apiLogin({ email, password });
      const u = res?.data?.user || res?.data?.data?.user || res?.data?.data;
      setUser(u);
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
      setUser(u);
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
