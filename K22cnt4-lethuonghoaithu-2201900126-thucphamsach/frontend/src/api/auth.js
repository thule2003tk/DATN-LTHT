import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const login = async (ten_dangnhap, matkhau) => {
  const res = await axios.post(`${API_URL}/login`, { ten_dangnhap, matkhau });
  return res.data;
};

export const register = async (user) => {
  const res = await axios.post(`${API_URL}/register`, user);
  return res.data;
};
