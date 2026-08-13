import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Only block on a session lookup when there is actually a token to verify.
  // First-time visitors render the storefront immediately, with no network wait.
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem("access"))
  );

  const clearSession = useCallback(() => {
    setUser(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    delete api.defaults.headers.common["Authorization"];
    window.dispatchEvent(new Event("user-logged-out"));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/jwt/create/", { email, password });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const userRes = await api.get("/auth/users/me/");
    setUser(userRes.data);
    return userRes.data;
  }, []);

  const logout = useCallback(() => {
    try {
      clearSession();
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Something went wrong during logout.");
    }
  }, [clearSession]);

  // Restore the session on a cold load.
  useEffect(() => {
    if (!localStorage.getItem("access")) return;

    let cancelled = false;

    api
      .get("/auth/users/me/")
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch(() => {
        // The axios interceptor already tried a refresh; reaching here means
        // the session is genuinely gone.
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  // Raised by the axios interceptor when a refresh fails.
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      window.dispatchEvent(new Event("user-logged-out"));
      toast.info("Your session has expired. Please sign in again.");
    };

    window.addEventListener("session-expired", handleExpired);
    return () => window.removeEventListener("session-expired", handleExpired);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: Boolean(user?.is_staff),
      login,
      logout,
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
