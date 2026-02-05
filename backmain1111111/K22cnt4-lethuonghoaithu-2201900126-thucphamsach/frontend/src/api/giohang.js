import axiosClient from "./axiosClient";

const API = "/giohang";

export const getGioHang = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};

export const updateCart = async (ma_giohang, soluong) => {
  await axiosClient.put(`${API}/${ma_giohang}`, { soluong });
};

export const deleteCart = async (ma_giohang) => {
  await axiosClient.delete(`${API}/${ma_giohang}`);
};
