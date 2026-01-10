// src/api/donhang.js
const API_URL = "http://localhost:3001/api/donhang";

// 1️⃣ Tạo đơn hàng mới (Checkout)
export const createOrder = async (ma_kh) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ma_kh }), // gửi mã khách hàng
  });
  const data = await res.json();
  return data;
};

// 2️⃣ Lấy tất cả đơn hàng (Admin)
export const getAllOrders = async () => {
  const token = localStorage.getItem("token"); // 🔹 token phải được lưu khi admin login
  const res = await fetch(`${API_URL}/admin`, {
    headers: {
      Authorization: `Bearer ${token}`, // 🔹 gửi token
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Dữ liệu trả về không hợp lệ"); // 🔹 xử lý lỗi 401
  }

  return await res.json(); // ✅ giờ đây sẽ là mảng orders
};


// 3️⃣ Lấy chi tiết đơn hàng theo mã đơn (Admin xem chi tiết)
export const getOrderDetail = async (ma_donhang) => {
  const res = await fetch(`${API_URL}/detail/${ma_donhang}`);
  const data = await res.json();
  return data;
};

// 4️⃣ Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (ma_donhang, trangthai) => {
  const res = await fetch(`${API_URL}/${ma_donhang}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trangthai }),
  });
  const data = await res.json();
  return data;
};
