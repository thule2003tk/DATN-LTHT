import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSanPhamById, getDonViBySanPham } from "../api/sanpham.js";
import { getDonViSanPhamByMaSP } from "../api/donvisanpham.js";
import { useCart } from "../context/CartContext.jsx";
import { Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
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

    const itemToAdd = {
      ...product,
      ma_dvt: selectedDonVi.ma_dvt,
      ten_dvt: selectedDonVi.ten_dvt,
      gia: selectedDonVi.gia,
      quantity: 1, // Đảm bảo dùng quantity đồng nhất với CartContext
    };

    if (goCheckout) {
      // 🚀 Mua ngay: Không thêm vào giỏ hàng chung, truyền thẳng data qua state
      navigate("/checkout", { state: { buyNowItem: itemToAdd } });
    } else {
      // Thêm vào giỏ bình thường
      addToCart(itemToAdd);
      navigate("/cart");
    }
  };

  return (
    <>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Container className="my-5">
        <Row className="g-5 align-items-center">
          <Col lg={6}>
            <img
              src={
                product.hinhanh?.startsWith("http")
                  ? product.hinhanh
                  : `http://localhost:3001/uploads/${product.hinhanh}`
              }
              alt={product.ten_sp}
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "500px", objectFit: "cover" }}
              onError={(e) => (e.target.src = "/no-image.jpg")}
            />
          </Col>

          <Col lg={6}>
            <h1 className="fw-bold text-success mb-3">{product.ten_sp}</h1>

            <p className="text-muted fs-5 mb-2">
              Loại: {product.loai_sp || "Thực phẩm sạch"}
            </p>

            {/* ===== ĐƠN VỊ TÍNH ===== */}
            {donViList.length > 0 ? (
              <>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Đơn vị tính</Form.Label>
                  <Form.Select
                    value={selectedDonVi?.ma_dvt}
                    onChange={(e) => {
                      const dv = donViList.find(
                        (d) => d.ma_dvt === e.target.value
                      );
                      setSelectedDonVi(dv);
                    }}
                  >
                    {donViList.map((dv) => (
                      <option key={dv.ma_dvt} value={dv.ma_dvt}>
                        {dv.ten_dvt} –{" "}
                        {Number(dv.gia).toLocaleString("vi-VN")}₫
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <p className="fw-bold text-success fs-2 mb-4">
                  Giá:{" "}
                  {Number(selectedDonVi.gia).toLocaleString("vi-VN")}₫ /{" "}
                  {selectedDonVi.ten_dvt}
                </p>
              </>
            ) : (
              <Alert variant="danger">
                ⚠️ Sản phẩm này chưa có đơn vị tính. Vui lòng liên hệ cửa hàng.
              </Alert>
            )}

            {/* Removed inline mota to move it above footer */}

            <div className="d-grid gap-3 d-md-flex">
              <Button
                variant="outline-success"
                size="lg"
                disabled={!selectedDonVi}
                onClick={() => handleAddToCart(false)}
              >
                <FaShoppingCart className="me-2" /> Thêm vào giỏ
              </Button>

              <Button
                variant="success"
                size="lg"
                disabled={!selectedDonVi}
                onClick={() => handleAddToCart(true)}
              >
                Mua ngay
              </Button>
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
