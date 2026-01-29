import axios from "axios";

/* ======================
   CONFIG
====================== */

const API_URL = "http://localhost:3001/api/DonViSanPham";

/* ======================
   SẢN PHẨM
====================== */

// 🔹 Lấy tất cả sản phẩm (dùng cho Home / ProductList)
export const getAllDonViSanPham = async () => {
  try {
    const res = await axios.get(API_URL);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getAllDonViSanPham:", err);
    return [];
  }
};

// 🔹 Lấy chi tiết sản phẩm theo mã ()
export const getDonViSanPhamById = async (ma_donvisp) => {
  if (!ma_donvisp) return null;

  try {
    const res = await axios.get(`${API_URL}/${ma_donvisp}`);
    return res.data || null;
  } catch (err) {
    console.error("❌ Lỗi getDonViSanPhamById:", err);
    return null;
  }
};

// 🔹 Lấy chi tiết sản phẩm theo mã SP (SP01, SP02, ...)
export const getDonViSanPhamByMaSP = async (ma_sp) => {
  if (!ma_sp) return null;

  try {
    const res = await axios.get(`${API_URL}/sanpham/${ma_sp}`);
    return res.data || null;
  } catch (err) {
    console.error("❌ Lỗi getDonViSanPhamByMaSP:",ma_sp, err);
    return null;
  }
};

/* ======================
   ĐƠN VỊ TÍNH
====================== */

// 🔥 Lấy danh sách đơn vị + giá theo sản phẩm
// API: GET /api/DonViSanPham/:ma_donvisp/donvi
export const getDonViByDonViSanPham = async (ma_donvisp) => {
  if (!ma_donvisp) return [];

  try {
    const res = await axios.get(`${API_URL}/${ma_donvisp}/donvi`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("❌ Lỗi getDonViByDonViSanPham:", err);
    return [];
  }
};
