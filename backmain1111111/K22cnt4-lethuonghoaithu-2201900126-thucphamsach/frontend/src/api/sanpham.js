import axiosClient from "./axiosClient";

const API = "/sanpham";

// 🔹 Lấy tất cả sản phẩm (dùng cho Home / ProductList)
export const getAllSanPham = async () => {
  const res = await axiosClient.get(API);
  return Array.isArray(res.data) ? res.data : [];
};

// 🔹 Lấy sản phẩm nổi bật (Bán chạy)
export const getFeaturedProducts = async () => {
  const res = await axiosClient.get(`${API}/featured`);
  return Array.isArray(res.data) ? res.data : [];
};

// 🔹 Lấy sản phẩm mới (Vừa nhập)
export const getNewArrivals = async () => {
  const res = await axiosClient.get(`${API}/newest`);
  return Array.isArray(res.data) ? res.data : [];
};

// 🔹 Lấy sản phẩm khuyến mãi (Tồn kho > 1 tuần)
export const getPromotionProducts = async () => {
  const res = await axiosClient.get(`${API}/promotion`);
  return Array.isArray(res.data) ? res.data : [];
};

// 🔹 Lấy chi tiết sản phẩm theo mã (SP01, SP02, ...)
export const getSanPhamById = async (ma_sp) => {
  if (!ma_sp) return null;
  const res = await axiosClient.get(`${API}/${ma_sp}`);
  return res.data || null;
};

// 🔥 Lấy danh sách đơn vị + giá theo sản phẩm
export const getDonViBySanPham = async (ma_sp) => {
  if (!ma_sp) return [];
  const res = await axiosClient.get(`${API}/${ma_sp}/donvi`);
  return Array.isArray(res.data) ? res.data : [];
};
