import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Tự động thêm token vào header
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Đăng ký
export const register = async (userData) => {
  const response = await api.post("/register", userData);
  return response.data;
};

// Đăng nhập – backend trả token + user → AuthContext tự load
export const login = async (ten_dangnhap, matkhau) => {
  const response = await api.post("/login", { ten_dangnhap, matkhau });
  return response.data; // không lưu thủ công ở đây nữa
};

// Lấy profile
export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// Đăng xuất (chỉ xóa ở client)
export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.clear();
};

// Kiểm tra login
export const isLoggedIn = () => !!sessionStorage.getItem("token");

export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export default api;