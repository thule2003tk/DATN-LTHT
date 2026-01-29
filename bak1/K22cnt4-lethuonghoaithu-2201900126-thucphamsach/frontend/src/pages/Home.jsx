import { useEffect, useState } from "react";
import { getAllSanPham } from "../api/sanpham.js";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  Container, Row, Col, Card, Button, Form, InputGroup,
  Navbar, Nav, Badge, NavDropdown
} from "react-bootstrap";
import { FaLeaf, FaTruck, FaShieldAlt, FaClock, FaShoppingCart, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getBlogsByCategory } from "../api/blog.js";
import { categories } from "../data/categories.js";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFoodTab, setActiveFoodTab] = useState("monan");

  const [foodSafetyData, setFoodSafetyData] = useState({
    monan: [],
    rausach: [],
    suckhoe: [],
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllSanPham();
        console.log("DEBUG: Products data:", data);
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("DEBUG: Data is not array:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error(err);
        setError("Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const monan = await getBlogsByCategory("monan");
        const rausach = await getBlogsByCategory("rausach");
        const suckhoe = await getBlogsByCategory("suckhoe");

        setFoodSafetyData({ monan, rausach, suckhoe });
      } catch (err) {
        console.error("Lỗi load blog:", err);
      }
    };
    loadBlogs();
  }, []);

  const featuredProducts = products;

  const banners = [
    { image: "https://img.pikbest.com/templates/20240706/fruit-fruit-banner-for-supermarket-store-green-background_10654794.jpg!bw700" },
    { image: "https://file.hstatic.net/200000271661/article/untitled-5-recovered_7b4bb62c75a5459e8b4ddd83ebbcc7df_grande.png" },
    { image: "https://trustfoods.vn/thumbnail/690x420x1/upload/photo/ghe-tham-website-8992.png" },
  ];



  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchTerm)}`;
    }
  };

  if (loading) return <div className="container mt-5 text-center"><h4 className="text-success">Đang tải sản phẩm...</h4></div>;
  if (error) return <div className="container mt-5 text-center text-danger"><h4>{error}</h4></div>;

  return (
    <>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categories={categories}
      />
      {/* SLIDER BANNER GIỮ NGUYÊN */}
      <Carousel responsive={responsive} autoPlay autoPlaySpeed={5000} infinite showDots={true}>
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.image}
              alt={`Banner ${index + 1}`}
              className="w-100"
              style={{ height: "70vh", objectFit: "cover" }}
            />
          </div>
        ))}
      </Carousel>

      {/* PHẦN LỢI ÍCH GIỮ NGUYÊN */}
      <Container className="my-5 py-4 bg-light rounded-3">
        <Row className="text-center g-4">
          <Col md={3} sm={6}>
            <FaLeaf size={60} className="text-success mb-3" />
            <h5>100% Hữu Cơ</h5>
            <p className="text-muted small">Không thuốc trừ sâu</p>
          </Col>
          <Col md={3} sm={6}>
            <FaTruck size={60} className="text-success mb-3" />
            <h5>Giao Hàng Nhanh</h5>
            <p className="text-muted small">Miễn phí nội thành</p>
          </Col>
          <Col md={3} sm={6}>
            <FaShieldAlt size={60} className="text-success mb-3" />
            <h5>An Toàn Tuyệt Đối</h5>
            <p className="text-muted small">Đạt chuẩn VietGAP</p>
          </Col>
          <Col md={3} sm={6}>
            <FaClock size={60} className="text-success mb-3" />
            <h5>Tươi Mỗi Ngày</h5>
            <p className="text-muted small">Thu hoạch trong ngày</p>
          </Col>
        </Row>
      </Container>

      {/* DANH MỤC SẢN PHẨM GIỮ NGUYÊN */}
      <Container className="my-5">
        <h2 className="text-center mb-5 fw-bold text-success">Danh Mục Sản Phẩm</h2>
        <Row className="g-4 text-center">
          {categories.map((cat) => (
            <Col md={2} sm={4} xs={6} key={cat.title}>
              <Link to={`/products?category=${cat.query}`} className="text-decoration-none">
                <Card className="border-0 shadow-sm category-card h-100 overflow-hidden">
                  <Card.Img
                    variant="top"
                    src={cat.image}
                    alt={cat.title}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                  <Card.Body className="py-3 bg-light">
                    <h5 className="text-success fw-bold mb-0">{cat.title}</h5>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* SẢN PHẨM NỔI BẬT GIỮ NGUYÊN */}
      <Container className="my-5 pb-5">
        <h2 className="text-center mb-5 fw-bold text-success">Sản Phẩm Nổi Bật</h2>
        <Row className="g-4">
          {featuredProducts.length === 0 ? (
            <Col>
              <p className="text-center text-muted">Chưa có sản phẩm nào</p>
            </Col>
          ) : (
            featuredProducts.map((p) => {
              const imageUrl = p.hinhanh
                ? p.hinhanh.startsWith("http")
                  ? p.hinhanh
                  : `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/uploads/${p.hinhanh}`
                : "/no-image.png";

              return (
                <Col md={3} sm={6} lg={3} key={p.ma_sp}>
                  <Link to={`/product/${p.ma_sp}`} className="text-decoration-none">
                    <Card className="h-100 border-0 shadow-sm product-card position-relative">
                      <img
                        src={imageUrl}
                        alt={p.ten_sp}
                        className="card-img-top"
                        style={{ height: "260px", objectFit: "cover" }}
                        onError={(e) => (e.target.src = "/no-image.png")}
                      />
                      <Card.Body className="d-flex flex-column p-4">
                        <h5 className="card-title fw-bold">{p.ten_sp}</h5>
                        <p className="text-muted small">{p.loai_sp || "Thực phẩm sạch"}</p>
                        <p className="fw-bold text-success fs-4 my-3">
                          {Number(p.gia).toLocaleString()}₫
                        </p>
                        <div className="mt-auto d-grid gap-2">
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
                          <Button
                            variant="success"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!user) {
                                navigate("/login");
                              } else {
                                addToCart(p);
                                navigate("/checkout");
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
            })
          )}
        </Row>

        {featuredProducts.length > 0 && (
          <div className="text-center mt-5">
            <Button variant="outline-success" size="lg" as={Link} to="/products">
              Xem tất cả sản phẩm
            </Button>
          </div>
        )}
      </Container>

      {/* AN TOÁN THÔNG TIN THỰC PHẨM - THÊM LINK CHI TIẾT */}
      <Container className="my-5 py-5 bg-light rounded-4">
        <h2 className="text-center mb-5 fw-bold text-success">
          AN TOÁN THÔNG TIN THỰC PHẨM
        </h2>

        <div className="text-center mb-5">
          <Button
            variant={activeFoodTab === "monan" ? "success" : "outline-success"}
            className="rounded-pill px-5 py-2 fw-bold me-3"
            onClick={() => setActiveFoodTab("monan")}
          >
            MÓN ĂN
          </Button>

          <Button
            variant={activeFoodTab === "rausach" ? "success" : "outline-success"}
            className="rounded-pill px-5 py-2 me-3"
            onClick={() => setActiveFoodTab("rausach")}
          >
            RAU SẠCH
          </Button>

          <Button
            variant={activeFoodTab === "suckhoe" ? "success" : "outline-success"}
            className="rounded-pill px-5 py-2"
            onClick={() => setActiveFoodTab("suckhoe")}
          >
            SỨC KHỎE
          </Button>
        </div>

        <Row className="g-4">
          {foodSafetyData[activeFoodTab].length === 0 ? (
            <Col>
              <p className="text-center text-muted">Chưa có bài viết nào trong mục này.</p>
            </Col>
          ) : (
            foodSafetyData[activeFoodTab].map((item, index) => (
              <Col lg={3} md={6} key={item.id || index}>
                {/* THÊM LINK Ở ĐÂY - Click card chuyển đến trang chi tiết */}
                <Link
                  to={`/blog/${item.id}`}  // ← ĐÂY LÀ CHỖ THÊM (đường dẫn /blog/:id)
                  className="text-decoration-none text-dark"
                  style={{ cursor: "pointer" }}
                >
                  <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden hover-lift">
                    <div className="text-center pt-4">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="rounded-circle border border-4 border-success"
                        style={{ width: "140px", height: "140px", objectFit: "cover" }}
                        onError={(e) => e.target.src = "/no-image.png"}
                      />
                    </div>
                    <Card.Body className="text-center pb-4">
                      <h5 className="fw-bold text-success mb-3">{item.title}</h5>
                      <p className="small text-muted mb-2">{item.desc1}</p>
                      <p className="text-secondary small">{item.desc2}</p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          )}
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default Home;