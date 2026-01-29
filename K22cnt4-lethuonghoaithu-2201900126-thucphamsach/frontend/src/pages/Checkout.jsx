import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Alert,
  Spinner,
  Form,
} from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

/* ================= API ================= */
const createOrder = async (orderData, token) => {
  const res = await fetch("http://localhost:3001/api/donhang", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Lỗi tạo đơn hàng");
  return data;
};

const thanhToanDonHang = async (ma_donhang, phuongthuc, sotien) => {
  const res = await fetch("http://localhost:3001/api/donhang/thanhtoan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ma_donhang, phuongthuc, sotien }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Lỗi thanh toán");
  return data;
};

/* ================= COMPONENT ================= */
function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [maDonHang, setMaDonHang] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [phuongthuc, setPhuongthuc] = useState("COD");

  const [shipping, setShipping] = useState({
    hoten: user?.hoten || "",
    sdt: "",
    diachi: "",
    ghichu: "",
  });

  /* ===== BẢO VỆ ROUTE ===== */
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  if (!user || cart.length === 0) {
    return (
      <Container className="my-5 text-center">
        <h2 className="text-success fw-bold">Thanh Toán Đơn Hàng</h2>
        <p className="text-muted mt-3">Giỏ hàng trống hoặc chưa đăng nhập</p>
        <Button as={Link} to="/" variant="success">
          <FaHome className="me-2" /> Về Trang Chủ
        </Button>
      </Container>
    );
  }

  /* ================= ĐẶT HÀNG ================= */
  const handleDatHang = async () => {
    setError("");
    setSuccess("");

    if (!shipping.hoten || !shipping.sdt || !shipping.diachi) {
      setError("❌ Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ma_kh: user.ma_kh,
        tongtien: totalPrice,
        phuongthuc,
        hoten_nhan: shipping.hoten,
        sdt_nhan: shipping.sdt,
        diachi_nhan: shipping.diachi,
        ghichu: shipping.ghichu,
        items: cart.map((i) => ({
          ma_sp: i.ma_sp,
          soluong: i.quantity,
          dongia: Number(i.gia),
        })),
      };

      const result = await createOrder(orderData, token);

      setMaDonHang(result.ma_donhang);
      setOrderPlaced(true);
      setSuccess(`✅ Đặt hàng thành công! Mã đơn: ${result.ma_donhang}`);

      // 👉 CHỈ clear cart khi đã tạo đơn thành công
      clearCart();
      localStorage.removeItem("cart");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= THANH TOÁN ================= */
  const handleThanhToan = async () => {
    if (!maDonHang) return;

    setLoading(true);
    setError("");

    try {
      await thanhToanDonHang(maDonHang, phuongthuc, totalPrice);
      setSuccess("🎉 Thanh toán thành công!");

      // 👉 CHUYỂN SANG ORDERS SAU KHI THANH TOÁN OK
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Container className="my-5">
      <h1 className="text-center text-success fw-bold mb-5">
        🧾 Thanh Toán Đơn Hàng
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row className="g-4">
        {/* ===== TRÁI ===== */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="fw-bold mb-3">🛒 Sản phẩm</h5>
              <Table>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>SL</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((i) => (
                    <tr key={i.ma_sp}>
                      <td>{i.ten_sp}</td>
                      <td>{i.gia.toLocaleString()}₫</td>
                      <td>{i.quantity}</td>
                      <td>
                        {(i.gia * i.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="fw-bold mb-3">📦 Thông tin giao hàng</h5>
              <Form.Control
                className="mb-2"
                placeholder="Họ tên"
                value={shipping.hoten}
                onChange={(e) =>
                  setShipping({ ...shipping, hoten: e.target.value })
                }
              />
              <Form.Control
                className="mb-2"
                placeholder="SĐT"
                value={shipping.sdt}
                onChange={(e) =>
                  setShipping({ ...shipping, sdt: e.target.value })
                }
              />
              <Form.Control
                className="mb-2"
                placeholder="Địa chỉ"
                value={shipping.diachi}
                onChange={(e) =>
                  setShipping({ ...shipping, diachi: e.target.value })
                }
              />
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Ghi chú"
                value={shipping.ghichu}
                onChange={(e) =>
                  setShipping({ ...shipping, ghichu: e.target.value })
                }
              />
            </Card.Body>
          </Card>
        </Col>

        {/* ===== PHẢI ===== */}
        <Col lg={4}>
          <Card>
            <Card.Body>
              <h5 className="fw-bold mb-3">💰 Thanh toán</h5>

              <p className="fw-bold fs-5">
                Tổng cộng:{" "}
                <span className="text-danger">
                  {totalPrice.toLocaleString()}₫
                </span>
              </p>

              {!orderPlaced ? (
                <Button
                  className="w-100"
                  size="lg"
                  onClick={handleDatHang}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                </Button>
              ) : (
                <>
                  <Form.Select
                    className="mb-3"
                    value={phuongthuc}
                    onChange={(e) => setPhuongthuc(e.target.value)}
                  >
                    <option value="COD">COD</option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                    <option value="Ví điện tử">Ví điện tử</option>
                  </Form.Select>

                  <Button
                    className="w-100"
                    variant="success"
                    onClick={handleThanhToan}
                    disabled={loading}
                  >
                    {loading ? "Đang thanh toán..." : "Thanh toán"}
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Checkout;
