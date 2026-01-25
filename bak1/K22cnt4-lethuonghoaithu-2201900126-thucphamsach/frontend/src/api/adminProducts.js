import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/sanpham`;

const authHeader = () => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export const getProducts = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeader());
  return res.data;
};
