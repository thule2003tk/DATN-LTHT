import axiosClient from "./axiosClient";

const API = "/blog";

export const getAllBlog = async () => {
  const res = await axiosClient.get(API);
  return res.data;
};

export const getBlogDetail = async (id) => {
  const res = await axiosClient.get(`${API}/${id}`);
  return res.data;
};

export const getBlogsByCategory = async (category) => {
  const res = await axiosClient.get(`${API}?category=${category}`);
  return res.data;
};

export const addBlog = async (blogData) => {
  const res = await axiosClient.post(API, blogData);
  return res.data;
};

export const updateBlog = async (id, blogData) => {
  const res = await axiosClient.put(`${API}/${id}`, blogData);
  return res.data;
};

export const deleteBlog = async (id) => {
  const res = await axiosClient.delete(`${API}/${id}`);
  return res.data;
};