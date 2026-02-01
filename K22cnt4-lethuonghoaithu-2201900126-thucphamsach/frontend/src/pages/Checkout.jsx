import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Modal,
} from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import khuyenMaiApi from "../api/khuyenmai.js";

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
  if (!res.ok) throw new Error(data.message || data.error || "Lỗi tạo đơn hàng");
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
  const location = useLocation();

  // 🚀 Nhận diện sản phẩm "Mua ngay" từ state
  const buyNowItem = location.state?.buyNowItem;

  // 📝 Xác định danh sách sản phẩm và tổng tiền hiển thị
  const displayCart = buyNowItem ? [buyNowItem] : cart;
  const displayTotalPrice = buyNowItem
    ? buyNowItem.gia * buyNowItem.quantity
    : totalPrice;

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

  /* ===== PROMO STATE ===== */
  const [promos, setPromos] = useState([]);
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  /* ===== BẢO VỆ ROUTE ===== */
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    fetchPromos();
  }, [user, navigate]);

  const fetchPromos = async () => {
    try {
      const res = await khuyenMaiApi.getActivePromos();
      setPromos(res.data || []);
    } catch (err) {
      console.error("Error fetching promos:", err);
    }
  };

  const handleApplyPromo = (code = null) => {
    const codeToApply = code || promoCodeInput.toUpperCase();
    const promo = promos.find(p => p.ma_km === codeToApply);

    if (!promo) {
      setError("❌ Mã giảm giá không tồn tại hoặc đã hết hạn.");
      setSelectedPromo(null);
      setDiscountAmount(0);
      return;
    }

    if (totalPrice < promo.giatri_don) {
      setError(`❌ Mã này chỉ áp dụng cho đơn hàng từ ${Number(promo.giatri_don).toLocaleString()}₫`);
      setSelectedPromo(null);
      setDiscountAmount(0);
      return;
    }

    setSelectedPromo(promo);
    const discount = (totalPrice * promo.mucgiam) / 100;
    setDiscountAmount(discount);
    setError("");
    setSuccess(`✅ Đã áp dụng mã ${promo.ma_km} (Giảm ${promo.mucgiam}%)`);
    setShowPromoModal(false);
  };

  if (!user || displayCart.length === 0) {
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
      // 🔍 Lấy ID: ma_kh, ma_nguoidung hoặc id
      const userId = user.ma_kh || user.ma_nguoidung || user.id;

      console.log("🚀 Bắt đầu đặt hàng cho User ID:", userId);

      const orderData = {
        ma_kh: userId,
        tongtien: displayTotalPrice - discountAmount,
        phuongthuc,
        hoten_nhan: shipping.hoten,
        sdt_nhan: shipping.sdt,
        diachi_nhan: shipping.diachi,
        ghichu: shipping.ghichu,
        ma_km: String(selectedPromo?.ma_km).length <= 10 ? selectedPromo?.ma_km : null, // Fix chiều dài ma_km
        items: displayCart.map((i) => ({
          ma_sp: i.ma_sp,
          soluong: i.quantity,
          dongia: Number(i.gia),
        })),
      };

      const result = await createOrder(orderData, token);

      if (phuongthuc === "Chuyển khoản") {
        // Nếu chuyển khoản, chuyển sang trang ThanhToan chuyên dụng
        navigate("/thanhtoan", {
          state: {
            ma_donhang: result.ma_donhang,
            tongtien: totalPrice - discountAmount
          }
        });
      } else {
        setMaDonHang(result.ma_donhang);
        setOrderPlaced(true);
        setSuccess(`✅ Đặt hàng thành công! Đang chuyển đến lịch sử đơn hàng...`);

        // 🔄 Tự động chuyển hướng sau 2 giây
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      }

      // 🔄 Chỉ xóa giỏ hàng nếu đây là thanh toán cả giỏ
      if (!buyNowItem) {
        clearCart();
      }
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
      await thanhToanDonHang(maDonHang, phuongthuc, totalPrice - discountAmount);
      setSuccess("🎉 Thanh toán thành công!");

      setTimeout(() => navigate("/orders"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <Container className="my-5 text-dark">
      <h1 className="text-center text-success fw-bold mb-5">
        🧾 Thanh Toán Đơn Hàng
      </h1>

      {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

      <Row className="g-4">
        {/* ===== TRÁI ===== */}
        <Col lg={8}>
          <Card className="mb-4 border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <FaShoppingCart className="me-2 text-success" /> Danh sách sản phẩm
              </h5>
              <Table responsive className="align-middle">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {displayCart.map((i) => (
                    <tr key={i.ma_sp}>
                      <td className="fw-bold">{i.ten_sp}</td>
                      <td>{i.gia.toLocaleString()}₫</td>
                      <td>{i.quantity}</td>
                      <td className="text-end fw-bold">
                        {(i.gia * i.quantity).toLocaleString()}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">📦 Thông tin giao hàng</h5>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Họ tên người nhận</Form.Label>
                <Form.Control
                  placeholder="Nhập họ tên"
                  value={shipping.hoten}
                  onChange={(e) => setShipping({ ...shipping, hoten: e.target.value })}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Số điện thoại</Form.Label>
                    <Form.Control
                      placeholder="Số điện thoại liên hệ"
                      value={shipping.sdt}
                      onChange={(e) => setShipping({ ...shipping, sdt: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold">Địa chỉ nhận hàng</Form.Label>
                    <Form.Control
                      placeholder="Số nhà, tên đường, phường/xã..."
                      value={shipping.diachi}
                      onChange={(e) => setShipping({ ...shipping, diachi: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label className="small fw-bold">Ghi chú (nếu có)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Dặn dò shipper..."
                  value={shipping.ghichu}
                  onChange={(e) => setShipping({ ...shipping, ghichu: e.target.value })}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== PHẢI ===== */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 text-success">🎟️ Mã giảm giá</h5>
              <div className="d-flex gap-2 mb-3">
                <Form.Control
                  placeholder="Nhập mã KM..."
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  className="bg-light border-0"
                />
                <Button variant="success" onClick={() => handleApplyPromo()}>
                  Áp dụng
                </Button>
              </div>
              <Button
                variant="link"
                className="p-0 text-success text-decoration-none small"
                onClick={() => setShowPromoModal(true)}
              >
                Xem danh sách mã khuyến mãi ?
              </Button>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: "20px" }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4">💰 Tóm tắt thanh toán</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính:</span>
                <span>{displayTotalPrice.toLocaleString()}₫</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Giảm giá:</span>
                <span className="text-danger">-{discountAmount.toLocaleString()}₫</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Tổng cộng:</span>
                <span className="text-success fw-bold fs-4">
                  {(displayTotalPrice - discountAmount).toLocaleString()}₫
                </span>
              </div>

              <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <span className="me-2">💳</span> Phương thức thanh toán
                  </h5>
                  <div className="d-flex flex-column gap-2">
                    <Form.Check
                      type="radio"
                      id="payment-cod"
                      label="Thanh toán khi nhận hàng (COD)"
                      name="paymentMethod"
                      value="COD"
                      checked={phuongthuc === "COD"}
                      onChange={(e) => setPhuongthuc(e.target.value)}
                      disabled={orderPlaced}
                    />
                    <Form.Check
                      type="radio"
                      id="payment-bank"
                      label="Chuyển khoản ngân hàng (QR)"
                      name="paymentMethod"
                      value="Chuyển khoản"
                      checked={phuongthuc === "Chuyển khoản"}
                      onChange={(e) => setPhuongthuc(e.target.value)}
                      disabled={orderPlaced}
                    />
                  </div>
                </Card.Body>
              </Card>

              {!orderPlaced ? (
                <Button
                  className="w-100 py-3 fw-bold rounded-3"
                  variant="success"
                  size="lg"
                  onClick={handleDatHang}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "XÁC NHẬN ĐẶT HÀNG"}
                </Button>
              ) : (
                <div className="text-center">
                  {phuongthuc === "Chuyển khoản" ? (
                    <Alert variant="info" className="small border-0 shadow-sm text-center">
                      <p className="mb-2"><strong>Quét mã QR để thanh toán:</strong></p>
                      <div className="bg-white p-2 rounded mb-2 d-inline-block shadow-sm">
                        <img
                          src={`https://img.vietqr.io/image/MB-0333333333333-compact.png?amount=${displayTotalPrice - discountAmount}&addInfo=THANH TOAN ${maDonHang}`}
                          className="img-fluid"
                          style={{ maxWidth: "220px" }}
                          alt="VietQR"
                        />
                      </div>
                      <p className="mb-1">Chủ TK: <strong>LE THUONG HOAI THU</strong></p>
                      <p className="mb-2 text-primary"><em>Hệ thống sẽ cập nhật sau khi bạn chuyển khoản.</em></p>
                      <Button
                        className="w-100 py-2 fw-bold"
                        variant="danger"
                        onClick={handleThanhToan}
                        disabled={loading}
                      >
                        {loading ? "ĐANG XỬ LÝ..." : "TÔI ĐÃ CHUYỂN KHOẢN"}
                      </Button>
                    </Alert>
                  ) : (
                    <>
                      <Alert variant="success" className="mb-3 rounded-3">
                        🎉 Đặt hàng thành công!
                      </Alert>
                      <Button
                        className="w-100 py-3 fw-bold rounded-3"
                        variant="primary"
                        onClick={() => navigate("/orders")}
                      >
                        XEM LỊCH SỬ ĐƠN HÀNG
                      </Button>
                    </>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL MÃ KHUYẾN MÃI */}
      <Modal show={showPromoModal} onHide={() => setShowPromoModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-success fw-bold">Chọn mã khuyến mãi</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          {promos.length > 0 ? (
            promos.map(p => (
              <div
                key={p.ma_km}
                className="d-flex mb-3 bg-white rounded-3 shadow-sm overflow-hidden"
                style={{ cursor: "pointer", opacity: totalPrice < p.giatri_don ? 0.6 : 1 }}
                onClick={() => totalPrice >= p.giatri_don && handleApplyPromo(p.ma_km)}
              >
                <div className="bg-success text-white p-3 d-flex flex-column justify-content-center text-center" style={{ minWidth: "80px" }}>
                  <div className="fw-bold fs-5">{p.mucgiam}%</div>
                  <small>GIẢM</small>
                </div>
                <div className="p-3 flex-grow-1">
                  <div className="fw-bold mb-1">{p.ma_km}</div>
                  <div className="small text-muted">{p.ten_km}</div>
                  <div className="small text-success mt-1">Đơn tối thiểu: {Number(p.giatri_don).toLocaleString()}₫</div>
                  {totalPrice < p.giatri_don && (
                    <div className="text-danger xsmall mt-1">Cần mua thêm {(p.giatri_don - totalPrice).toLocaleString()}₫ để áp dụng</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted">Hiện tại không có mã giảm giá nào khả dụng.</div>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Checkout;
