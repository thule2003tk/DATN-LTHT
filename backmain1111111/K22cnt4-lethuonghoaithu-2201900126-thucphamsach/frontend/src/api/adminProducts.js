import axiosClient from "./axiosClient";

const API = "/admin/products";

export const getProducts = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};

export const getProductById = async (id) => {
  const res = await axiosClient.get(`${API}/${id}`);
  return res.data;
};

export const addProduct = async (formData) => {
  return axiosClient.post(API, formData);
};

export const updateProduct = async (id, formData) => {
  return axiosClient.put(`${API}/${id}`, formData);
};

export const deleteProduct = async (id) => {
  return axiosClient.delete(`${API}/${id}`);
};
