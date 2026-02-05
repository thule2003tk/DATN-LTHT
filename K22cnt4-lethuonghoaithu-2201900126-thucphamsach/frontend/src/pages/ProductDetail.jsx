import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getSanPhamById, getDonViBySanPham } from "../api/sanpham.js";
import { getDonViSanPhamByMaSP } from "../api/donvisanpham.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Row, Col, Button, Form, Alert, Badge, Modal, Toast, ToastContainer } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { FaCheckCircle, FaFileContract, FaSearchPlus } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth(); // Need user for check

  const [product, setProduct] = useState(null);
  const [donViList, setDonViList] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    if (searchQuery) setSearchTerm(decodeURIComponent(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("👉 Load product:", id);

        const sp = await getSanPhamById(id);
        console.log("✅ Product:", sp);

        if (!sp) {
          setProduct(null);
          return;
        }

        setProduct(sp);

        const donvi = await getDonViSanPhamByMaSP(id);
        console.log("✅ DonVi:", donvi);

        setDonViList(donvi || []);
        if (donvi?.length > 0) {
          setSelectedDonVi(donvi[0]);
        }
      } catch (err) {
        console.error("❌ ProductDetail error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  /* ================== RENDER ================== */

  const handleAddToCart = (goCheckout = false) => {
    if (!selectedDonVi) return;
    if (!user) return navigate("/login");

    const originalPrice = Number(selectedDonVi.gia);
    const discount = Number(product.phan_tram_giam_gia || 0);
    const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

    const itemToAdd = {
      ...product,
      ma_dvt: selectedDonVi.ma_dvt,
      ten_dvt: selectedDonVi.ten_dvt,
      gia: finalPrice, // Sử dụng giá đã giảm
      original_gia: originalPrice,
      quantity: quantity,
    };

    if (goCheckout) {
      navigate("/checkout", { state: { buyNowItem: itemToAdd } });
    } else {
      addToCart(itemToAdd);
      setToastMsg(`Đã thêm ${quantity} ${selectedDonVi.ten_dvt} "${product.ten_sp}" vào giỏ hàng!`);
      setShowToast(true);
    }
  };

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {loading ? (
        <div className="text-center py-5 min-vh-100 d-flex align-items-center justify-content-center text-success">
          <div className="spinner-border me-2"></div>
          <h4>Đang tải sản phẩm...</h4>
        </div>
      ) : !product ? (
        <div className="text-center py-5 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <h4>❌ Không tìm thấy sản phẩm</h4>
          <Button variant="success" onClick={() => navigate("/")} className="mt-3">
            Quay về trang chủ
          </Button>
        </div>
      ) : (
        <Container className="my-5 pt-lg-4">
          <Row className="g-5">
            {/* IMAGE COLUMN */}
            <Col lg={5} md={12}>
              <div
                className="product-image-container overflow-hidden rounded-4 shadow-sm border bg-white"
                style={{ aspectRatio: "1/1", position: "relative", maxHeight: "550px" }}
              >
                <img
                  src={
                    product.hinhanh?.startsWith("http")
                      ? product.hinhanh
                      : `http://localhost:3001/uploads/${product.hinhanh}`
                  }
                  alt={product.ten_sp}
                  className="w-100 h-100 d-block"
                  style={{ objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/no-image.jpg")}
                />
                {Number(product.phan_tram_giam_gia || 0) > 0 && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-0 m-4 px-3 py-2 fs-6 shadow-sm"
                    style={{ zIndex: 2 }}
                  >
                    -{product.phan_tram_giam_gia}% OFF
                  </Badge>
                )}
              </div>
            </Col>

            {/* INFO COLUMN */}
            <Col lg={7} md={12} className="d-flex flex-column justify-content-center">
              <div className="ps-lg-4">
                <nav aria-label="breadcrumb" className="mb-3">
                  <ol className="breadcrumb small text-uppercase fw-bold letter-spacing-1">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-success" aria-current="page">{product.loai_sp || "Sản phẩm"}</li>
                  </ol>
                </nav>

                <h1 className="display-5 fw-bold text-dark mb-2">{product.ten_sp}</h1>

                <div className="d-flex align-items-center gap-3 mb-4">
                  {Number(product.soluong_ton) > 0 ? (
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2">
                      ● Còn hàng: {product.soluong_ton} {product.donvitinh || "sản phẩm"}
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 px-3 py-2">
                      ✕ Tạm hết hàng
                    </Badge>
                  )}
                  <span className="text-muted small">SKU: {product.ma_sp}</span>
                </div>

                {/* ===== GIÁ CẢ & ĐƠN VỊ ===== */}
                <div className="bg-light p-4 rounded-4 mb-4 border border-white shadow-sm">
                  {donViList.length > 0 ? (
                    <>
                      <Form.Group className="mb-4">
                        <Form.Label className="small fw-bold text-uppercase text-muted">Chọn trọng lượng / Quy cách</Form.Label>
                        <Form.Select
                          className="form-select-lg border-0 shadow-sm"
                          value={selectedDonVi?.ma_dvt}
                          onChange={(e) => {
                            const dv = donViList.find((d) => d.ma_dvt === e.target.value);
                            setSelectedDonVi(dv);
                          }}
                        >
                          {donViList.map((dv) => {
                            const discount = Number(product.phan_tram_giam_gia || 0);
                            const originalPrice = Number(dv.gia);
                            const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
                            return (
                              <option key={dv.ma_dvt} value={dv.ma_dvt}>
                                {dv.ten_dvt} – {finalPrice.toLocaleString("vi-VN")}₫
                              </option>
                            );
                          })}
                        </Form.Select>
                      </Form.Group>

                      <div className="d-flex align-items-baseline gap-3 mb-2">
                        <span className="display-6 fw-bold text-success">
                          {((Number(selectedDonVi.gia) * (1 - Number(product.phan_tram_giam_gia || 0) / 100))).toLocaleString("vi-VN")}₫
                        </span>
                        {Number(product.phan_tram_giam_gia || 0) > 0 && (
                          <span className="text-muted text-decoration-line-through fs-5">
                            {Number(selectedDonVi.gia).toLocaleString("vi-VN")}₫
                          </span>
                        )}
                      </div>
                      <div className="text-muted small">Đơn giá áp dụng cho 1 {selectedDonVi.ten_dvt}</div>
                    </>
                  ) : (
                    <Alert variant="warning" className="border-0 shadow-sm rounded-3">
                      ⚠️ Sản phẩm đang cập nhật giá. Vui lòng quay lại sau.
                    </Alert>
                  )}
                </div>

                {/* ===== THAO TÁC ===== */}
                <div className="row g-3">
                  <Col sm={4} lg={3}>
                    <Form.Group>
                      <div className="input-group input-group-lg border rounded-3 overflow-hidden bg-white shadow-sm">
                        <Button
                          variant="link"
                          className="text-dark text-decoration-none px-3"
                          disabled={Number(product.soluong_ton) <= 0}
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          -
                        </Button>
                        <Form.Control
                          type="number"
                          className="border-0 text-center fw-bold bg-transparent px-0 fs-5"
                          value={quantity}
                          style={{ boxShadow: 'none' }}
                          disabled={Number(product.soluong_ton) <= 0}
                          onChange={(e) => setQuantity(Math.max(1, Math.min(Number(product.soluong_ton), parseInt(e.target.value) || 1)))}
                        />
                        <Button
                          variant="link"
                          className="text-dark text-decoration-none px-3"
                          disabled={Number(product.soluong_ton) <= 0 || quantity >= Number(product.soluong_ton)}
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </Form.Group>
                  </Col>
                  <Col sm={8} lg={9}>
                    <div className="h-100 d-flex gap-2">
                      <Button
                        variant="outline-success"
                        className="flex-grow-1 fw-bold rounded-3 border-2 h-100 py-3"
                        disabled={!selectedDonVi || Number(product.soluong_ton) <= 0}
                        onClick={() => handleAddToCart(false)}
                      >
                        THÊM VÀO GIỎ
                      </Button>
                      <Button
                        variant="success"
                        className="flex-grow-1 fw-bold rounded-3 shadow h-100 py-3"
                        disabled={!selectedDonVi || Number(product.soluong_ton) <= 0}
                        onClick={() => handleAddToCart(true)}
                      >
                        MUA NGAY
                      </Button>
                    </div>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>

          {/* ================= THÔNG TIN CHI TIẾT DƯỚI ĐÂY ================= */}
          <hr className="my-5" />
          <Row className="mb-5">
            <Col md={6} className="mb-4 mb-md-0">
              <div className="p-4 bg-light rounded shadow-sm h-100">
                <h3 className="fw-bold text-success border-bottom pb-3 mb-3">
                  🌿 Mô tả sản phẩm
                </h3>
                <div
                  className="fs-5 text-muted"
                  style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                >
                  {product.mota || "Đang cập nhật nội dung..."}
                </div>
              </div>
            </Col>

            <Col md={6}>
              <div className="p-4 bg-light rounded shadow-sm h-100">
                <h3 className="fw-bold text-success border-bottom pb-3 mb-3">
                  🔍 Thông tin chi tiết
                </h3>
                <div
                  className="fs-5 text-muted"
                  style={{ whiteSpace: "pre-line", textAlign: "justify" }}
                >
                  {product.thongtin_sanpham || "Đang cập nhật nội dung..."}
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col md={12}>
              <div className="p-4 bg-light rounded shadow-sm border-start border-success border-4">
                <h3 className="fw-bold text-success border-bottom pb-3 mb-3 d-flex align-items-center gap-2">
                  <FaCheckCircle /> Chứng nhận Thực phẩm sạch
                </h3>
                {product.giay_chung_nhan ? (
                  <Row className="align-items-center">
                    <Col lg={7} className="mb-3 mb-lg-0">
                      <p className="fs-5 text-muted mb-3">
                        Tại <strong>HTFood</strong>, chất lượng sản phẩm và sức khỏe người dùng là ưu tiên hàng đầu.
                        Sản phẩm này đã vượt qua các quy trình kiểm định nghiêm ngặt và được cấp giấy chứng nhận <strong>VSATTP / VietGAP</strong> chuẩn quy định.
                      </p>
                      <ul className="list-unstyled">
                        <li className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                          <FaCheckCircle /> Nguồn gốc xuất xứ rõ ràng 100%
                        </li>
                        <li className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                          <FaCheckCircle /> Không chứa thuốc trừ sâu & hóa chất độc hại
                        </li>
                        <li className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                          <FaCheckCircle /> Quy trình đóng gói khép kín, vô trùng
                        </li>
                      </ul>
                    </Col>
                    <Col lg={5}>
                      <div className="text-center">
                        <div
                          className="position-relative overflow-hidden rounded-3 border bg-white shadow-sm cursor-pointer mx-auto"
                          style={{ maxWidth: "400px", cursor: "zoom-in" }}
                          onClick={() => setShowCertModal(true)}
                        >
                          <img
                            src={`http://localhost:3001/uploads/${product.giay_chung_nhan}`}
                            alt="Chứng nhận"
                            className="w-100 d-block"
                            style={{ objectFit: 'contain' }}
                          />
                          <div className="position-absolute bottom-0 end-0 bg-dark bg-opacity-50 text-white p-2 small px-3 rounded-start">
                            <FaSearchPlus className="me-1" /> Nhấn để xem chứng nhận
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <div className="text-center py-4">
                    <FaFileContract size={50} className="text-muted mb-3 d-block mx-auto opacity-25" />
                    <p className="text-muted">Đang cập nhật chứng nhận kiểm định cho lô hàng này. HTFood cam kết luôn cung cấp thực phẩm sạch nhất!</p>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* MODAL XEM CHỨNG NHẬN */}
          <Modal show={showCertModal} onHide={() => setShowCertModal(false)} size="lg" centered>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="text-success fw-bold">📜 Giấy chứng nhận Thực phẩm sạch</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0 bg-dark">
              <img
                src={`http://localhost:3001/uploads/${product.giay_chung_nhan}`}
                className="w-100"
                alt="Chứng nhận phóng to"
              />
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center bg-light">
              <div className="d-flex align-items-center gap-2 text-success fw-bold">
                <FaCheckCircle /> Cam kết Thực phẩm sạch 100% tại HTFood
              </div>
            </Modal.Footer>
          </Modal>
        </Container>
      )}

      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="border-0 shadow-lg rounded-3">
          <Toast.Header closeButton={false} className="bg-success text-white border-0 py-2">
            <FaCheckCircle className="me-2" />
            <strong className="me-auto">Thông báo</strong>
            <small>Vừa xong</small>
          </Toast.Header>
          <Toast.Body className="bg-white py-3 fw-medium">
            {toastMsg}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Footer />
    </>
  );
}

export default ProductDetail;
