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
} from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Footer from "../components/Footer.jsx";

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
    if (searchQuery) {
      setSearchTerm(decodeURIComponent(searchQuery));
    }
  }, [searchQuery]);

  useEffect(() => {
    let filtered = products;

    if (categoryQuery) {
      filtered = products.filter(p => p.ma_danhmuc === categoryQuery);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.ten_sp.toLowerCase().includes(term) ||
          (p.ten_danhmuc && p.ten_danhmuc.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(filtered);
  }, [categoryQuery, searchTerm, products]);

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
                      </div>
                      <Card.Body className="d-flex flex-column p-4">
                        <h5 className="card-title fw-bold text-truncate">
                          {p.ten_sp}
                        </h5>
                        <p className="text-muted small">
                          {p.ten_danhmuc || "Thực phẩm sạch"}
                        </p>
                        <p className="fw-bold text-success fs-4 my-3">
                          {Number(p.gia).toLocaleString("vi-VN")}₫
                        </p>
                        <div className="mt-auto d-grid gap-2">
                          {/* "THÊM VÀO GIỎ" → THÊM + CHUYỂN SANG GIỎ HÀNG */}
                          <Button
                            variant="outline-success"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate("/login");
                              } else {
                                addToCart(p);
                                navigate("/cart");
                              }
                            }}
                          >
                            <FaShoppingCart className="me-2" /> Thêm vào giỏ
                          </Button>
                          {/* "MUA NGAY" → KHÔNG THÊM VÀO GIỎ, CHUYỂN THẲNG STATE SANG THANH TOÁN */}
                          <Button
                            variant="success"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate("/login");
                              } else {
                                // 🚀 Truyền thẳng sản phẩm qua state để Checkout nhận diện "Mua ngay"
                                navigate("/checkout", {
                                  state: {
                                    buyNowItem: { ...p, quantity: 1 }
                                  }
                                });
                              }
                            }}
                          >
                            Mua ngay
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
      <style jsx>{`
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
