import axiosClient from "./axiosClient";

const API = "/donhang";

// 1️⃣ Tạo đơn hàng mới (Checkout)
export const createOrder = async (orderData) => {
  const res = await axiosClient.post(API, orderData);
  return res.data;
};

// 2️⃣ Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async () => {
  const res = await axiosClient.get(API); // Backend route cho admin là GET /
  return res.data;
};

// 3️⃣ Lấy chi tiết đơn hàng
export const getOrderDetail = async (ma_donhang) => {
  const res = await axiosClient.get(`${API}/detail/${ma_donhang}`);
  return res.data;
};

// 4️⃣ Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (ma_donhang, data) => {
  // data should be { trangthai, ly_do_huy }
  const res = await axiosClient.put(`${API}/${ma_donhang}/status`, data);
  return res.data;
};

// 5️⃣ Lấy lịch sử đơn hàng của User
export const getOrdersByUser = async (ma_kh) => {
  const res = await axiosClient.get(`${API}/user/${ma_kh}`);
  return res.data;
};