import { useEffect, useState } from "react";
import { getGioHang, deleteCart } from "../api/giohang.js";
import { createOrder } from "../api/donhang.js";

function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const ma_kh = "KH01"; // tạm test, sau này lấy từ user đăng nhập

  const fetchCart = async () => {
    setLoading(true);
    const data = await getGioHang(ma_kh);
    setCart(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Giỏ hàng trống!");
    try {
      // Tạo đơn hàng
      const order = await createOrder(ma_kh);
      alert("Đặt hàng thành công! Mã đơn: " + order.ma_donhang);

      // Xóa giỏ hàng sau khi đặt
      for (const item of cart) {
        await deleteCart(item.ma_giohang);
      }

      fetchCart(); // cập nhật lại giỏ hàng
    } catch (err) {
      console.log(err);
      alert("Lỗi khi đặt hàng!");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.soluong * item.gia, 0);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="container mt-4">
      <h1>Thanh toán</h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.ma_giohang}>
                  <td>{item.ten_sp}</td>
                  <td>{item.gia.toLocaleString()}₫</td>
                  <td>{item.soluong}</td>
                  <td>{(item.gia * item.soluong).toLocaleString()}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Tổng cộng: {totalPrice.toLocaleString()}₫</h3>
          <button className="btn btn-success" onClick={handleCheckout}>
            Đặt hàng
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
