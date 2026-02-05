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
  Badge,
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

  const [maDonHang] = useState(() => "DH" + Date.now().toString() + Math.floor(100 + Math.random() * 900));
  const [phuongthuc, setPhuongthuc] = useState("COD");
  const [maBiMat] = useState(() => Math.random().toString(36).substr(2, 10).toUpperCase());

  const [shipping, setShipping] = useState({
    hoten: user?.hoten || "",
    sdt: user?.sodienthoai || user?.sdt || "",
    email: user?.email || "",
    diachi: user?.diachi || "",
    ghichu: "",
  });

  // 🔄 Tự động cập nhật thông tin giao hàng khi dữ liệu user sẵn sàng
  useEffect(() => {
    if (user) {
      setShipping(prev => ({
        ...prev,
        hoten: prev.hoten || user.hoten || "",
        sdt: prev.sdt || user.sodienthoai || user.sdt || "",
        email: prev.email || user.email || "",
        diachi: prev.diachi || user.diachi || "",
      }));
    }
  }, [user]);

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
      const res = await khuyenMaiApi.getMinePromos();
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

    if (displayTotalPrice < promo.giatri_don) {
      setError(`❌ Mã này chỉ áp dụng cho đơn hàng từ ${Number(promo.giatri_don).toLocaleString()}₫`);
      setSelectedPromo(null);
      setDiscountAmount(0);
      return;
    }

    setSelectedPromo(promo);
    const discount = (displayTotalPrice * promo.mucgiam) / 100;
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

    // 🛡️ Xác nhận trước khi đặt hàng
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn đặt hàng không?");
    if (!isConfirmed) return;

    setLoading(true);

    try {
      const userId = user.ma_kh || user.ma_nguoidung || user.id;

      const orderData = {
        ma_kh: userId,
        tongtien: displayTotalPrice - discountAmount,
        phuongthuc,
        hoten_nhan: shipping.hoten,
        sdt_nhan: shipping.sdt,
        email_nhan: shipping.email,
        diachi_nhan: shipping.diachi,
        ghichu: shipping.ghichu,
        ma_km: String(selectedPromo?.ma_km).length <= 10 ? selectedPromo?.ma_km : null,
        ma_bi_mat: maBiMat,
        ma_donhang: maDonHang,
        items: displayCart.map((i) => ({
          ma_sp: i.ma_sp,
          soluong: i.quantity,
          dongia: Number(i.gia),
        })),
        isBuyNow: !!buyNowItem,
      };

      const result = await createOrder(orderData, token);

      setSuccess(`✅ Đặt hàng thành công! Đang chuyển đến lịch sử đơn hàng...`);

      // 🔄 Chỉ xóa giỏ hàng nếu đây là thanh toán cả giỏ
      if (!buyNowItem) {
        clearCart();
      }

      // 🔄 Tự động chuyển hướng sau 1.5 giây
      setTimeout(() => {
        navigate("/orders");
      }, 1500);

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
                    <th style={{ width: "80px" }}>Ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {displayCart.map((i) => {
                    const originalPrice = i.original_gia || i.gia;
                    const discountPercent = i.phan_tram_giam_gia || 0;
                    const isDiscounted = discountPercent > 0;
                    const imgUrl = i.hinhanh?.startsWith("http")
                      ? i.hinhanh
                      : `http://localhost:3001/uploads/${i.hinhanh}`;

                    return (
                      <tr key={i.ma_sp}>
                        <td>
                          <img
                            src={imgUrl}
                            alt={i.ten_sp}
                            className="rounded-3 border shadow-sm"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                            onError={(e) => (e.target.src = "/no-image.jpg")}
                          />
                        </td>
                        <td>
                          <div className="fw-bold">{i.ten_sp}</div>
                          {isDiscounted && (
                            <Badge bg="danger" className="small">-{discountPercent}%</Badge>
                          )}
                        </td>
                        <td>
                          {isDiscounted ? (
                            <div className="d-flex flex-column">
                              <span className="text-danger fw-bold">{Number(i.gia).toLocaleString()}₫</span>
                              <small className="text-muted text-decoration-line-through">{Number(originalPrice).toLocaleString()}₫</small>
                            </div>
                          ) : (
                            <span>{Number(i.gia).toLocaleString()}₫</span>
                          )}
                        </td>
                        <td>{i.quantity}</td>
                        <td className="text-end fw-bold">
                          {(i.gia * i.quantity).toLocaleString()}₫
                        </td>
                      </tr>
                    );
                  })}
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
                    <Form.Label className="small fw-bold">Email người nhận</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email để nhận thông báo"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold">Địa chỉ nhận hàng</Form.Label>
                <Form.Control
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={shipping.diachi}
                  onChange={(e) => setShipping({ ...shipping, diachi: e.target.value })}
                />
              </Form.Group>
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
                  <div className="d-flex flex-column gap-3">
                    <Form.Check
                      type="radio"
                      id="payment-cod"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="me-2">🚚</span>
                          <div>
                            <div className="fw-bold">Thanh toán khi nhận hàng (COD)</div>
                            <small className="text-muted">Thanh toán bằng tiền mặt khi giao hàng</small>
                          </div>
                        </div>
                      }
                      name="paymentMethod"
                      value="COD"
                      checked={phuongthuc === "COD"}
                      onChange={(e) => setPhuongthuc(e.target.value)}
                      className="p-3 border rounded-3 border-2"
                      style={{ transition: "0.3s", cursor: "pointer", borderColor: phuongthuc === "COD" ? "#198754" : "#dee2e6" }}
                    />
                    <Form.Check
                      type="radio"
                      id="payment-bank"
                      label={
                        <div className="d-flex align-items-center">
                          <span className="me-2">🏦</span>
                          <div>
                            <div className="fw-bold">Chuyển khoản ngân hàng (QR)</div>
                            <small className="text-muted">Quét mã QR để thanh toán nhanh chóng</small>
                          </div>
                        </div>
                      }
                      name="paymentMethod"
                      value="Chuyển khoản"
                      checked={phuongthuc === "Chuyển khoản"}
                      onChange={(e) => setPhuongthuc(e.target.value)}
                      className="p-3 border rounded-3 border-2"
                      style={{ transition: "0.3s", cursor: "pointer", borderColor: phuongthuc === "Chuyển khoản" ? "#198754" : "#dee2e6" }}
                    />
                  </div>

                  {phuongthuc === "Chuyển khoản" && (
                    <div className="mt-4 p-3 bg-light rounded-3 border border-success border-opacity-25 text-center">
                      <p className="mb-2 fw-bold text-success">📸 Mã QR Thanh Toán Dự Kiến</p>
                      <div className="bg-white p-2 rounded mb-3 d-inline-block shadow-sm">
                        <img
                          src={`https://img.vietqr.io/image/MB-0916761528-compact.png?amount=${displayTotalPrice - discountAmount}&addInfo=THANH TOAN ${maDonHang} ${maBiMat}`}
                          className="img-fluid"
                          style={{ maxWidth: "250px" }}
                          alt="VietQR Preview"
                        />
                      </div>
                      <div className="text-start small mx-auto" style={{ maxWidth: "300px" }}>
                        <p className="mb-1">Ngân hàng: <strong>MB Bank</strong></p>
                        <p className="mb-1">Chủ TK: <strong>LE THUONG HOAI THU</strong></p>
                        <p className="mb-1">STK: <strong>0916761528</strong></p>
                        <p className="mb-0 text-danger italic">* Nội dung: <strong>THANH TOAN {maDonHang} {maBiMat}</strong></p>
                      </div>
                      <Alert variant="warning" className="mt-3 p-2 small mb-0">
                        ⚠️ Sau khi nhấn "XÁC NHẬN ĐẶT HÀNG", mã đơn hàng chính thức sẽ được tạo.
                      </Alert>
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Button
                className="w-100 py-3 fw-bold rounded-3"
                variant="success"
                size="lg"
                onClick={handleDatHang}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "XÁC NHẬN ĐẶT HÀNG"}
              </Button>
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
                style={{
                  cursor: displayTotalPrice >= p.giatri_don ? "pointer" : "not-allowed",
                  opacity: displayTotalPrice < p.giatri_don ? 0.5 : 1,
                  border: selectedPromo?.ma_km === p.ma_km ? "2px solid #198754" : "1px solid #eee"
                }}
                onClick={() => displayTotalPrice >= p.giatri_don && handleApplyPromo(p.ma_km)}
              >
                <div className="bg-success text-white p-3 d-flex flex-column justify-content-center text-center" style={{ minWidth: "80px" }}>
                  <div className="fw-bold fs-5">{p.mucgiam}%</div>
                  <small>GIẢM</small>
                </div>
                <div className="p-3 flex-grow-1">
                  <div className="fw-bold mb-1">{p.ma_km}</div>
                  <div className="small text-muted">{p.ten_km}</div>
                  <div className="small text-success mt-1">Đơn tối thiểu: {Number(p.giatri_don).toLocaleString()}₫</div>
                  {displayTotalPrice < p.giatri_don && (
                    <div className="text-danger small mt-1 fw-bold">
                      Cần mua thêm {(p.giatri_don - displayTotalPrice).toLocaleString()}₫ để áp dụng
                    </div>
                  )}
                  {selectedPromo?.ma_km === p.ma_km && (
                    <div className="text-success small mt-1 fw-bold">✓ Đang chọn</div>
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
