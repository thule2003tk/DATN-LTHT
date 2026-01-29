import axios from "axios";

const API = "http://localhost:3001/api/admin/products";

export const getProducts = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const addProduct = async (formData) => {
  return axios.post(API, formData);
};

export const updateProduct = async (id, formData) => {
  return axios.put(`${API}/${id}`, formData);
};

export const deleteProduct = async (id) => {
  return axios.delete(`${API}/${id}`);
};
