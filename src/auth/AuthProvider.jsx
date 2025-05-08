import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const res = await api.post("/auth/jwt/create/", { email, password });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    api.defaults.headers.common["Authorization"] = `JWT ${res.data.access}`;

    const userRes = await api.get("/auth/users/me/");
    setUser(userRes.data);
    return userRes.data;
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem("cachedProducts");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      delete api.defaults.headers.common["Authorization"];
      window.dispatchEvent(new Event("user-logged-out"));
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Something went wrong during logout.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      api.defaults.headers.common["Authorization"] = `JWT ${token}`;
      api
        .get("/auth/users/me/")
        .then((res) => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="min-h-screen flex justify-center items-center">
  <div className="spinner"></div>
</div>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
