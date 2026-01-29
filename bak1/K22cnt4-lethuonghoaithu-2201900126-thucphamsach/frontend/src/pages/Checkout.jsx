import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Table, Alert, Spinner, Form } from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/categories.js";

// API tạo đơn hàng (giữ nguyên)
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

// API thanh toán (thêm mới - lưu vào bảng thanhtoan + cập nhật donhang)
const thanhToanDonHang = async (ma_donhang, phuongthuc, sotien) => {
  const ma_tt = "TT" + Math.floor(100000 + Math.random() * 900000); // Tạo mã thanh toán tự động

  const response = await fetch("http://localhost:3001/api/donhang/thanhtoan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ma_donhang,
      phuongthuc,
      sotien,
      ma_tt,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Lỗi thanh toán");
  }

  return await response.json();
};

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false); // Đã đặt đơn → hiện form thanh toán
  const [maDonHang, setMaDonHang] = useState(null); // Lưu ma_donhang sau khi tạo
  const [phuongthuc, setPhuongthuc] = useState("COD"); // Phương thức mặc định

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

  const handleDatHang = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Debug
    console.log("User hiện tại khi đặt hàng:", user);
    console.log("ma_kh gửi lên backend:", user?.ma_kh);

    try {
      const orderData = {
        ma_kh: user?.ma_kh || null,
        ngay_dat: new Date().toISOString(),
        tongtien: totalPrice,
        trangthai: "Chờ xử lý", // backend sẽ override dựa trên phuongthuc nếu cần
        phuongthuc: phuongthuc, // ← THÊM DÒNG NÀY để backend biết set trạng thái ban đầu
        ma_km: null,
        items: cart.map((item) => ({
          ma_sp: item.ma_sp,
          soluong: item.quantity,
          dongia: Number(item.gia),
        })),
      };

      console.log("Dữ liệu đặt hàng:", orderData);

      const result = await createOrder(orderData, token);

      setMaDonHang(result.ma_donhang); // Lưu mã đơn để thanh toán

      clearCart?.();
      localStorage.removeItem("cart");

      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      savedOrders.push({
        ma_donhang: result.ma_donhang,
        date: new Date().toISOString(),
        items: cart,
        total: totalPrice,
        status: "Chờ xử lý", // trạng thái ban đầu sẽ được backend set đúng
      });
      localStorage.setItem("orders", JSON.stringify(savedOrders));

      setOrderPlaced(true); // Chuyển sang bước thanh toán
      setSuccess(`Đặt hàng thành công! Mã đơn: ${result.ma_donhang}`);
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      setError(err.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleThanhToan = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await thanhToanDonHang(maDonHang, phuongthuc, totalPrice);

      setSuccess(
        `Thanh toán thành công! 🎉\n` +
        `Mã thanh toán: ${res.ma_tt || "TTXXXXXX"}\n` +
        `Trạng thái đơn: ${res.trangthai}\n\n` +
        "Đang chuyển về danh sách đơn hàng..."
      );

      // Chuyển về trang danh sách đơn hàng sau 4 giây
      setTimeout(() => navigate("/orders", { replace: true }), 4000);
    } catch (err) {
      setError(err.message || "Lỗi thanh toán. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // THÊM LOGIC REDIRECT CHO PHƯƠNG THỨC NGOÀI COD (demo link, bạn thay real nếu cần)
  const handleRedirectThanhToan = () => {
    let redirectUrl = "";
    if (phuongthuc === "Chuyển khoản") {
      redirectUrl = `https://www.nganluong.vn/button_payment.php?receiver=your_email&product_name=DonHang_${maDonHang}&price=${totalPrice}`; // Demo ngân hàng
    } else if (phuongthuc === "Ví điện tử") {
      redirectUrl = `https://developers.momo.vn/v2/vi/docs/test-payment?amount=${totalPrice}&orderId=${maDonHang}`; // Demo Momo
    }

    if (redirectUrl) {
      window.open(redirectUrl, "_blank"); // Mở tab mới thanh toán
      // Sau thanh toán (demo) → lưu DB tự động
      handleThanhToan();
    }
  };

  return (
    <>
      <Header categories={categories} />
      <Container className="my-5 py-5">
        <h1 className="text-center mb-5 text-success fw-bold">Thanh Toán Đơn Hàng</h1>

        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess("")}>
            {success}
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

        {!orderPlaced ? (
          // Bước 1: Đặt hàng (giữ nguyên như bạn)
          <div className="text-center mt-5 d-grid gap-3">
            <Button
              variant="success"
              size="lg"
              className="px-5 py-3 fw-bold"
              onClick={handleDatHang}
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
        ) : (
          // Bước 2: Thanh toán (thêm mới - hiện form chọn phương thức)
          <div className="mt-5">
            <h3 className="text-center text-success mb-4">Chọn phương thức thanh toán</h3>

            <Form className="mx-auto" style={{ maxWidth: "500px" }}>
              <Form.Group className="mb-4">
                <Form.Label>Phương thức thanh toán</Form.Label>
                <Form.Select value={phuongthuc} onChange={(e) => setPhuongthuc(e.target.value)}>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
                  <option value="Ví điện tử">Ví điện tử (Momo/ZaloPay)</option>
                </Form.Select>
              </Form.Group>

              <Button
                variant="success"
                size="lg"
                className="w-100 py-3 fw-bold"
                onClick={phuongthuc === "COD" ? handleThanhToan : handleRedirectThanhToan} // COD: lưu DB, khác: redirect + lưu
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang thanh toán...
                  </>
                ) : (
                  "Xác Nhận Thanh Toán"
                )}
              </Button>
            </Form>
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Checkout;