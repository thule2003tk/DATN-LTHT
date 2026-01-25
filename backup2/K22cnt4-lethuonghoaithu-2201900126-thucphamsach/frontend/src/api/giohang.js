import axios from "axios";

const API = "http://localhost:3001/api/giohang";

const authHeader = () => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export const getGioHang = async () => {
  const res = await axios.get(API, authHeader());
  return res.data;
};

export const updateCart = async (ma_giohang, soluong) => {
  await axios.put(`${API}/${ma_giohang}`, { soluong }, authHeader());
};

export const deleteCart = async (ma_giohang) => {
  await axios.delete(`${API}/${ma_giohang}`, authHeader());
};
