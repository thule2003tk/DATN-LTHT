import axiosClient from "./axiosClient";

const API_URL = "/admin/users";

// Lấy danh sách user
export const getUsers = async () => {
  const res = await axiosClient.get(API_URL);
  return res.data;
};

// Admin duyệt / đổi role
export const updateUserRole = async (id, vai_tro) => {
  const res = await axiosClient.put(
    `${API_URL}/${id}/role`,
    { vai_tro }
  );
  return res.data;
};

// Admin chặn / mở chặn
export const updateUserStatus = async (id, status) => {
  const res = await axiosClient.put(
    `${API_URL}/${id}/status`,
    { status }
  );
  return res.data;
};
