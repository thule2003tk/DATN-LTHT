import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSanPhamById } from "../api/sanpham.js";
import { useCart } from "../context/CartContext.jsx"; // THÊM DÒNG NÀY – QUAN TRỌNG NHẤT
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/categories.js";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("search");

  const { addToCart } = useCart(); // LẤY HÀM THÊM GIỎ THẬT
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSanPhamById(id);
        setProduct(data);
        console.log("data", data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className="text-center py-5">
        <h4>Đang tải sản phẩm...</h4>
      </div>
    );

  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
      />
      <Container className="my-5">
        <Row className="g-5 align-items-center">
          <Col lg={6}>
            <img
              src={
                product.hinhanh.startsWith("http")
                  ? product.hinhanh
                  : `http://localhost:3001/uploads/${product.hinhanh}`
              }
              alt={product.ten_sp}
              className="img-fluid rounded shadow-lg"
              style={{ maxHeight: "500px", objectFit: "cover" }}
              onError={(e) => (e.target.src = "/no-image.png")}
            />
          </Col>
          <Col lg={6}>
            <h1 className="fw-bold text-success mb-3">{product.ten_sp}</h1>
            <p className="text-muted fs-5 mb-2">
              Loại: {product.loai_sp || "Thực phẩm sạch"}
            </p>
            <p className="fw-bold text-success fs-2 mb-4">
              Giá: {Number(product.gia).toLocaleString("vi-VN")}₫
            </p>
            <p className="fs-5 text-muted mb-5">
              Mô tả:{" "}
              {product.mota ||
                "Sản phẩm tươi sạch, được tuyển chọn kỹ lưỡng từ nông trại uy tín."}
            </p>

            <div className="d-grid gap-3 d-md-flex">
              {/* "THÊM VÀO GIỎ" → THÊM THẬT + CHUYỂN SANG GIỎ HÀNG */}
              <Button
                variant="outline-success"
                size="lg"
                onClick={() => {
                  addToCart(product);
                  navigate("/cart");
                }}
              >
                <FaShoppingCart className="me-2" /> Thêm vào giỏ
              </Button>

              {/* "MUA NGAY" → THÊM THẬT + CHUYỂN SANG THANH TOÁN */}
              <Button
                variant="success"
                size="lg"
                onClick={() => {
                  addToCart(product);
                  navigate("/checkout");
                }}
              >
                Mua ngay
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default ProductDetail;
