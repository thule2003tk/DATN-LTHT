import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      // ƯU TIÊN USER TỪ LOCAL
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      }

      // fallback: gọi API
      try {
        const res = await getProfile();
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch {
        localStorage.clear();
        setUser(null);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
