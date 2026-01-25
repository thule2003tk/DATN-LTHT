// src/api/donhang.js
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/donhang`;

// Lấy token từ localStorage (dùng cho admin)
const getToken = () => localStorage.getItem("token");

// 1️⃣ Tạo đơn hàng mới (Checkout)
export const createOrder = async (ma_kh) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ma_kh }),
  });
  if (!res.ok) throw new Error("Lỗi tạo đơn hàng");
  return await res.json();
};

// 2️⃣ Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async () => {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Không thể lấy đơn hàng");
  }

  return await res.json();
};

// 3️⃣ Lấy chi tiết đơn hàng
export const getOrderDetail = async (ma_donhang) => {
  const res = await fetch(`${API_URL}/detail/${ma_donhang}`);
  if (!res.ok) throw new Error("Lỗi lấy chi tiết");
  return await res.json();
};

// 4️⃣ Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (ma_donhang, trangthai) => {
  const res = await fetch(`${API_URL}/${ma_donhang}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trangthai }),
  });
  if (!res.ok) throw new Error("Lỗi cập nhật trạng thái");
  return await res.json();
};