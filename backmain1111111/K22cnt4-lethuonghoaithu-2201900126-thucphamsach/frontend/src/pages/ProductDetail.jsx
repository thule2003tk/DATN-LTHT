import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSanPhamById, getDonViBySanPham } from "../api/sanpham.js";
import { getDonViSanPhamByMaSP } from "../api/donvisanpham.js";
import { useCart } from "../context/CartContext.jsx";
import { Container, Row, Col, Button, Form, Alert, Badge } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [donViList, setDonViList] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4>Đang tải sản phẩm...</h4>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-5">
        <h4>❌ Không tìm thấy sản phẩm</h4>
        <Button variant="success" onClick={() => navigate("/")}>
          Quay về trang chủ
        </Button>
      </div>
    );
  }

  const handleAddToCart = (goCheckout = false) => {
    if (!selectedDonVi) return;

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
      navigate("/cart");
    }
  };

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
                  <li className="breadcrumb-item"><a href="/" className="text-decoration-none text-muted">Trang chủ</a></li>
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
      </Container>

      <Footer />
    </>
  );
}

export default ProductDetail;
