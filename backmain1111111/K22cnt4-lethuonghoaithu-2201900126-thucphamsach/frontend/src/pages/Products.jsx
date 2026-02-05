import { useEffect, useState } from "react";
import { getAllSanPham } from "../api/sanpham.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Footer from "../components/Footer.jsx";
import { getCategoryIcon } from "../utils/iconHelper";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const currentCategoryObj = categories.find(c => c.ma_danhmuc === categoryQuery);
  const currentCategoryTitle = currentCategoryObj ? currentCategoryObj.ten_danhmuc : (categoryQuery ? "Loại sản phẩm" : "Tất Cả Sản Phẩm");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getDanhMuc } = await import("../api/danhmuc");
        const [prodData, catData] = await Promise.all([
          getAllSanPham(),
          getDanhMuc()
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm hoặc danh mục");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSearchTerm(searchQuery ? decodeURIComponent(searchQuery) : "");
  }, [searchQuery]);

  useEffect(() => {
    let filtered = products;

    console.log("Current Filtering:", { categoryQuery, searchTerm, totalProducts: products.length });

    if (categoryQuery) {
      filtered = products.filter(p =>
        String(p.ma_danhmuc) === String(categoryQuery) ||
        p.ten_danhmuc === categoryQuery // Hỗ trợ fallback nếu query là tên danh mục
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (p) => {
          const inName = p.ten_sp && p.ten_sp.toLowerCase().includes(term);
          const inCat = p.ten_danhmuc && p.ten_danhmuc.toLowerCase().includes(term);
          // Chỉ tìm trong mô tả nếu từ khóa dài (> 4 ký tự) để tránh nhầm "thịt" trong "thịt xoài"
          const inDesc = term.length > 4 && p.mota && p.mota.toLowerCase().includes(term);

          return inName || inCat || inDesc;
        }
      );
    }

    setFilteredProducts(filtered);
  }, [categoryQuery, searchTerm, products]);

  const getDisplayPrice = (p) => {
    const originalPrice = Number(p.gia);
    const discount = Number(p.phan_tram_giam_gia || 0);
    if (discount > 0) {
      const discountedPrice = originalPrice * (1 - discount / 100);
      return (
        <div className="my-3">
          <span className="fw-bold text-danger fs-4 me-2">
            {discountedPrice.toLocaleString("vi-VN")}₫
          </span>
          <span className="text-muted text-decoration-line-through small">
            {originalPrice.toLocaleString("vi-VN")}₫
          </span>
        </div>
      );
    }
    return (
      <p className="fw-bold text-success fs-4 my-3">
        {originalPrice.toLocaleString("vi-VN")}₫
      </p>
    );
  };

  if (loading)
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-success">Đang tải sản phẩm...</h4>
      </div>
    );
  if (error)
    return (
      <div className="container mt-5 text-center text-danger">
        <h4>{error}</h4>
      </div>
    );

  return (
    <>
      {/* <div className="position-fixed top-0 start-0 m-3 z-3">
        <Button variant="success" size="lg" as={Link} to="/" className="shadow-lg rounded-pill px-4 py-3 d-flex align-items-center gap-2">
          <FaHome size={20} />
          <span className="d-none d-sm-inline">Trở về Trang Chủ</span>
        </Button>
      </div> */}

      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Container className="my-5 pt-5">
        <h1 className="text-center mb-4 fw-bold text-success">
          {currentCategoryTitle}
        </h1>

        <Row className="mb-5">
          <Col md={8} lg={6} className="mx-auto">
            <Form onSubmit={(e) => e.preventDefault()}>
              <InputGroup size="lg">
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm sản phẩm (ví dụ: tôm hùm, rau muống, thịt bò...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-success"
                />
                <Button variant="success">Tìm</Button>
              </InputGroup>
            </Form>
            <p className="text-center text-muted mt-3">
              Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
            </p>
          </Col>
        </Row>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted">
              Không tìm thấy sản phẩm nào phù hợp 😔
            </h4>
            <Button
              variant="outline-success"
              size="lg"
              onClick={() => (window.location.href = "/products")}
            >
              Xem tất cả sản phẩm
            </Button>
          </div>
        ) : (
          <Row className="g-4 pb-5">
            {filteredProducts.map((p) => {
              const imageUrl = p.hinhanh
                ? p.hinhanh.startsWith("http")
                  ? p.hinhanh
                  : `http://localhost:3001/uploads/${p.hinhanh}`
                : "/no-image.png";

              return (
                <Col md={4} lg={3} sm={6} key={p.ma_sp}>
                  <Link
                    to={`/product/${p.ma_sp}`}
                    className="text-decoration-none"
                  >
                    <Card className="h-100 border-0 shadow-sm product-card overflow-hidden">
                      <div className="position-relative">
                        <img
                          src={imageUrl}
                          alt={p.ten_sp}
                          className="card-img-top"
                          style={{ height: "280px", objectFit: "cover" }}
                          onError={(e) => (e.target.src = "/no-image.png")}
                        />
                        {p.phan_tram_giam_gia > 0 && (
                          <Badge bg="danger" className="position-absolute top-0 start-0 m-3 shadow-sm">
                            -{p.phan_tram_giam_gia}%
                          </Badge>
                        )}
                        {Number(p.soluong_ton) <= 0 && (
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
                            style={{ zIndex: 1 }}
                          >
                            <Badge bg="secondary" className="fs-5 px-3 py-2 shadow border border-white">
                              HẾT HÀNG
                            </Badge>
                          </div>
                        )}
                      </div>
                      <Card.Body className="d-flex flex-column p-4">
                        <h5 className="card-title fw-bold text-truncate">
                          {p.ten_sp}
                        </h5>
                        <p className="text-muted small d-flex align-items-center gap-1">
                          <span className="text-success">{getCategoryIcon(p.icon, p.ten_danhmuc)}</span>
                          {p.ten_dm_chinh || p.ten_danhmuc || "Thực phẩm sạch"}
                        </p>
                        {getDisplayPrice(p)}
                        <div className="mt-auto d-grid gap-2">
                          <Button
                            variant="outline-success"
                            disabled={Number(p.soluong_ton) <= 0}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate("/login");
                              } else {
                                const discount = Number(p.phan_tram_giam_gia || 0);
                                const finalPrice = discount > 0 ? Number(p.gia) * (1 - discount / 100) : Number(p.gia);
                                addToCart({ ...p, gia: finalPrice });
                                navigate("/cart");
                              }
                            }}
                          >
                            <FaShoppingCart className="me-2" />
                            {Number(p.soluong_ton) <= 0 ? "Hết hàng" : "Thêm vào giỏ"}
                          </Button>
                          <Button
                            variant="success"
                            disabled={Number(p.soluong_ton) <= 0}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate("/login");
                              } else {
                                const discount = Number(p.phan_tram_giam_gia || 0);
                                const finalPrice = discount > 0 ? Number(p.gia) * (1 - discount / 100) : Number(p.gia);
                                navigate("/checkout", {
                                  state: {
                                    buyNowItem: { ...p, gia: finalPrice, quantity: 1 }
                                  }
                                });
                              }
                            }}
                          >
                            {Number(p.soluong_ton) <= 0 ? "Tạm hết" : "Mua ngay"}
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
      <Footer></Footer>
      <style>{`
        .product-card:hover {
          transform: translateY(-12px);
          transition: all 0.4s ease;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
        }
        .product-card .card-img-top {
          transition: transform 0.6s ease;
        }
        .product-card:hover .card-img-top {
          transform: scale(1.1);
        }
      `}</style>
    </>
  );
}

export default Products;
