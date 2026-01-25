import { useEffect, useState } from "react";
import { getAllSanPham } from "../api/sanpham.js";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Header from "../components/Header";
import { 
  Container, Row, Col, Card, Button, Form, InputGroup, 
  Navbar, Nav, Badge, NavDropdown 
} from "react-bootstrap";
import { FaLeaf, FaTruck, FaShieldAlt, FaClock, FaShoppingCart, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { getBlogsByCategory } from "../api/blog.js";

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
        setProducts(data);
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

  const categories = [
    { title: "Rau Củ Sạch", query: "rau-cu", image: "https://dantra.vn/uploads/san-pham/topic-2/rau-sach-da-lat/6527f2744ee7feb9a7f612.jpg" },
    { title: "Hoa Quả Tươi", query: "hoa-qua", image: "https://kamereo.vn/blog/wp-content/uploads/2024/06/cac-loai-qua-ngon-1.jpg" },
    { title: "Hải Sản Tươi Sống", query: "hai-san", image: "https://giangghe.com/upload/news/kinh-nghiem-chon-hai-san-1139.jpg" },
    { title: "Đồ Khô Hữu Cơ", query: "do-kho", image: "https://cdn.tgdd.vn/2021/06/content/1-800x450-91.jpg" },
    { title: "Thực Phẩm Theo Mùa", query: "theo-mua", image: "https://sagogifts.vn/wp-content/uploads/trai-cay-nhieu-chat-xo-it-duong-SagoGifts.jpg" },
    { title: "Thịt Sạch", query: "thit", image: "https://truongfoods.vn/wp-content/uploads/2022/10/dia-chi-mua-thit-lon-sach-an-toan-uy-tin-o-ha-noi.jpg" },
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
                  : `http://localhost:3001/uploads/${p.hinhanh}`
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

      {/* HOVER EFFECT - XÓA KHỐI NÀY ĐỂ HẾT WARNING JSX */}
      {/* <style jsx>{`...`}</style> */} {/* ← COMMENT HOẶC XÓA DÒNG NÀY */}

      {/* FOOTER GIỮ NGUYÊN */}
      <footer className="bg-success text-white py-5 mt-5">
        <Container>
          <Row className="g-4">
            <Col lg={4} md={6}>
              <h4 className="fw-bold mb-4">Thực Phẩm Sạch</h4>
              <p className="text-light">
                Cam kết mang đến sản phẩm hữu cơ, sạch 100%, tươi mới mỗi ngày từ nông trại đến bàn ăn của bạn.
              </p>
              <div className="d-flex gap-3 mt-3">
                <a href="#" className="text-white fs-4"><FaFacebook /></a>
                <a href="#" className="text-white fs-4"><FaInstagram /></a>
                <a href="#" className="text-white fs-4"><FaYoutube /></a>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-4">Liên Kết Nhanh</h5>
              <Nav className="flex-column">
                <Nav.Link as={Link} to="/" className="text-light py-2">Trang chủ</Nav.Link>
                <Nav.Link as={Link} to="/products" className="text-light py-2">Sản phẩm</Nav.Link>
                <Nav.Link as={Link} to="/about" className="text-light py-2">Giới thiệu</Nav.Link>
                <Nav.Link as={Link} to="/contact" className="text-light py-2">Liên hệ</Nav.Link>
              </Nav>
            </Col>

            <Col lg={3} md={6}>
              <h5 className="fw-bold mb-4">Hỗ Trợ Khách Hàng</h5>
              <Nav className="flex-column">
                <Nav.Link href="#" className="text-light py-2">Chính sách đổi trả</Nav.Link>
                <Nav.Link href="#" className="text-light py-2">Chính sách giao hàng</Nav.Link>
                <Nav.Link href="#" className="text-light py-2">Hướng dẫn mua hàng</Nav.Link>
                <Nav.Link href="#" className="text-light py-2">Câu hỏi thường gặp</Nav.Link>
              </Nav>
            </Col>

            <Col lg={2} md={6}>
              <h5 className="fw-bold mb-4">Liên Hệ</h5>
              <div className="small text-light">
                <p className="mb-2"><FaMapMarkerAlt className="me-2" />123 Đường ABC, Q.1, TP.HCM</p>
                <p className="mb-2"><FaPhone className="me-2" />1900 1234</p>
                <p className="mb-2"><FaEnvelope className="me-2" />support@thucphamsach.vn</p>
              </div>
            </Col>
          </Row>

          <hr className="my-4 border-light" />

          <div className="text-center small">
            © 2026 Thực Phẩm Sạch. All rights reserved.
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Home;