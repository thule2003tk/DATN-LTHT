import axios from "axios";

const API_URL = "http://localhost:3001/api/admin/users";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getAllUsers = () =>
  axios.get(API_URL, authHeader()).then(res => res.data);

export const updateUserRole = (id, vai_tro) =>
  axios.put(`${API_URL}/${id}/role`, { vai_tro }, authHeader());

export const deleteUser = (id) =>
  axios.delete(`${API_URL}/${id}`, authHeader());
