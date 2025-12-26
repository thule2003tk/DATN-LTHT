import axios from "axios";

const API_URL = "http://localhost:3001/api/giohang";

export const getGioHang = async (ma_kh) => {
  try {
    const res = await axios.get(`${API_URL}/user/${ma_kh}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const updateCart = async (ma_giohang, soluong) => {
  try {
    await axios.put(`${API_URL}/${ma_giohang}`, { soluong });
  } catch (err) {
    console.error(err);
  }
};

export const deleteCart = async (ma_giohang) => {
  try {
    await axios.delete(`${API_URL}/${ma_giohang}`);
  } catch (err) {
    console.error(err);
  }
};
