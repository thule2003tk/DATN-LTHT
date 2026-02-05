import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Ưu tiên từ sessionStorage
      const savedUser = sessionStorage.getItem("user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        console.log("User từ sessionStorage:", parsed);
        setUser(parsed);
        setLoading(false);
        return;
      }

      // Gọi API profile
      try {
        const res = await getProfile();
        console.log("Response từ getProfile:", res);
        // Linh hoạt: lấy user từ res.user hoặc res trực tiếp
        const rawUser = res.user || res;

        // Normalize: tự động lấy ma_kh dù tên trường khác nhau
        const ma_kh = rawUser.ma_kh || rawUser.ma_nguoidung || rawUser.id || rawUser.maKh || rawUser.customer_id || rawUser.ma_khach_hang || null;

        const normalizedUser = {
          ...rawUser,
          ma_kh: ma_kh,
        };

        console.log("Normalized User with Role:", normalizedUser.vai_tro);

        setUser(normalizedUser);
        sessionStorage.setItem("user", JSON.stringify(normalizedUser));
      } catch (err) {
        console.error("Lỗi get profile:", err);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};