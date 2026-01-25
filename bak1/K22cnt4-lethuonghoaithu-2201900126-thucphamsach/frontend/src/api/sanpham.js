import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/sanpham`;

export const getAllSanPham = async () => {
  try {
    console.log("DEBUG: Calling API_URL:", API_URL);
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getSanPhamById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
