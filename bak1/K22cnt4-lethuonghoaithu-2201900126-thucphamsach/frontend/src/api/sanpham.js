import axios from "axios";

const API_URL = "http://localhost:3001/api/sanpham";

export const getAllSanPham = async () => {
  try {
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
