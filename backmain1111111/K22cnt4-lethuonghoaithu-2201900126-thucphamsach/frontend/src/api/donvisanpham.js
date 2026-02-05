import axiosClient from "./axiosClient";

const API = "/DonViSanPham";

// 🔹 Lấy tất cả sản phẩm
export const getAllDonViSanPham = async () => {
  const res = await axiosClient.get(API);
  return Array.isArray(res.data) ? res.data : [];
};

// 🔹 Lấy chi tiết sản phẩm theo mã donvisp
export const getDonViSanPhamById = async (ma_donvisp) => {
  if (!ma_donvisp) return null;
  const res = await axiosClient.get(`${API}/${ma_donvisp}`);
  return res.data || null;
};

// 🔹 Lấy chi tiết sản phẩm theo mã SP
export const getDonViSanPhamByMaSP = async (ma_sp) => {
  if (!ma_sp) return null;
  const res = await axiosClient.get(`${API}/sanpham/${ma_sp}`);
  return res.data || null;
};

// 🔥 Lấy danh sách đơn vị + giá theo sản phẩm
export const getDonViByDonViSanPham = async (ma_donvisp) => {
  if (!ma_donvisp) return [];
  const res = await axiosClient.get(`${API}/${ma_donvisp}/donvi`);
  return Array.isArray(res.data) ? res.data : [];
};
