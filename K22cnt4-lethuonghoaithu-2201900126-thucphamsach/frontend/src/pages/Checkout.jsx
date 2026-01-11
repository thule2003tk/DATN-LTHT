import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Table, Alert, Spinner } from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

// API tạo đơn hàng
const createOrder = async (orderData, token = null) => {
  const response = await fetch("http://localhost:3001/api/donhang", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || errorData.message || `Lỗi ${response.status}: ${response.statusText}`
    );
  }

  return await response.json();
};

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true, state: { from: "/checkout" } });
    }
  }, [user, navigate]);

  if (cart.length === 0 || !user) {
    return (
      <Container className="my-5 py-5 text-center">
        <h1 className="text-success mb-5 fw-bold">Thanh Toán Đơn Hàng</h1>
        <p className="fs-4 text-muted">
          {cart.length === 0 ? "Giỏ hàng trống" : "Vui lòng đăng nhập để tiếp tục"}
        </p>
        <Button variant="success" size="lg" as={Link} to={cart.length === 0 ? "/" : "/login"}>
          <FaHome className="me-2" /> {cart.length === 0 ? "Tiếp tục mua sắm" : "Đăng nhập"}
        </Button>
      </Container>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    // Debug
    console.log("User hiện tại khi đặt hàng:", user);
    console.log("ma_kh gửi lên backend:", user?.ma_kh);

    try {
      const orderData = {
        ma_kh: user?.ma_kh || null,  // ← Đã normalize ở AuthContext
        ngay_dat: new Date().toISOString(),
        tongtien: totalPrice,
        trangthai: "Chờ xử lý",
        ma_km: null,
        items: cart.map((item) => ({
          ma_sp: item.ma_sp,
          soluong: item.quantity,
          dongia: Number(item.gia),
        })),
      };

      console.log("Dữ liệu gửi lên API:", orderData);

      const result = await createOrder(orderData, token);

      clearCart?.();
      localStorage.removeItem("cart");

      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      savedOrders.push({
        ma_donhang: result.ma_donhang,
        date: new Date().toISOString(),
        items: cart,
        total: totalPrice,
        status: "Chờ xử lý",
      });
      localStorage.setItem("orders", JSON.stringify(savedOrders));

      alert(
        `Đặt hàng thành công! 🎉\n` +
        `Mã đơn: ${result.ma_donhang}\n` +
        `Tổng tiền: ${totalPrice.toLocaleString("vi-VN")}₫\n\n` +
        "Cảm ơn bạn đã mua sắm tại Thực Phẩm Sạch 🥬🌿"
      );

      navigate("/orders", { replace: true });
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      setError(err.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5 py-5">
      <h1 className="text-center mb-5 text-success fw-bold">Thanh Toán Đơn Hàng</h1>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Table striped bordered hover responsive className="table-success shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.ma_sp}>
              <td className="fw-medium">{item.ten_sp}</td>
              <td>{Number(item.gia).toLocaleString("vi-VN")}₫</td>
              <td className="text-center">{item.quantity}</td>
              <td className="fw-bold text-success">
                {(Number(item.gia) * item.quantity).toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-end mt-4">
        <h2 className="text-success">
          Tổng cộng: <strong className="text-danger fs-1">{totalPrice.toLocaleString("vi-VN")}₫</strong>
        </h2>
      </div>

      <div className="text-center mt-5 d-grid gap-3">
        <Button
          variant="success"
          size="lg"
          className="px-5 py-3 fw-bold"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Đang xử lý...
            </>
          ) : (
            "Xác Nhận Đặt Hàng"
          )}
        </Button>

        <Button variant="outline-success" size="lg" as={Link} to="/cart">
          <FaShoppingCart className="me-2" /> Quay lại giỏ hàng
        </Button>

        <Button variant="outline-primary" size="lg" as={Link} to="/">
          <FaHome className="me-2" /> Trở về Trang Chủ
        </Button>
      </div>
    </Container>
  );
}

export default Checkout;