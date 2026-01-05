import axios from "axios";

const API_URL = "http://localhost:3001/api/admin/users";

const authHeader = () => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

// Lấy danh sách user
export const getUsers = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

// Admin duyệt / đổi role
export const updateUserRole = async (id, vai_tro) => {
  const res = await axios.put(
    `${API_URL}/${id}/role`,
    { vai_tro },
    authHeader()
  );
  return res.data;
};
