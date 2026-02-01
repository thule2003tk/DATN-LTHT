import axios from "axios";

/* ======================
   CONFIG
====================== */

const API_URL = "http://localhost:3001/api/sanpham";

/* ======================
   SẢN PHẨM
====================== */

// 🔹 Lấy tất cả sản phẩm (dùng cho Home / ProductList)
export const getAllSanPham = async () => {
  try {
    const res = await axios.get(API_URL);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getAllSanPham:", err);
    return [];
  }
};

// 🔹 Lấy sản phẩm nổi bật (Bán chạy)
export const getFeaturedProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/featured`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getFeaturedProducts:", err);
    return [];
  }
};

// 🔹 Lấy sản phẩm mới (Vừa nhập)
export const getNewArrivals = async () => {
  try {
    const res = await axios.get(`${API_URL}/newest`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getNewArrivals:", err);
    return [];
  }
};

// 🔹 Lấy sản phẩm khuyến mãi (Tồn kho > 1 tuần)
export const getPromotionProducts = async () => {
  try {
    const res = await axios.get(`${API_URL}/promotion`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getPromotionProducts:", err);
    return [];
  }
};

// 🔹 Lấy chi tiết sản phẩm theo mã (SP01, SP02, ...)
export const getSanPhamById = async (ma_sp) => {
  if (!ma_sp) return null;

  try {
    const res = await axios.get(`${API_URL}/${ma_sp}`);
    return res.data || null;
  } catch (err) {
    console.error("❌ Lỗi getSanPhamById:", err);
    return null;
  }
};

/* ======================
   ĐƠN VỊ TÍNH
====================== */

// 🔥 Lấy danh sách đơn vị + giá theo sản phẩm
// API: GET /api/sanpham/:ma_sp/donvi
export const getDonViBySanPham = async (ma_sp) => {
  if (!ma_sp) return [];

  try {
    const res = await axios.get(`${API_URL}/${ma_sp}/donvi`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getDonViBySanPham:", err);
    return [];
  }
};
