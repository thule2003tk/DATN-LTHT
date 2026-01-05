import { useEffect, useState } from "react";
import { getAllSanPham } from "../api/sanpham.js";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { 
  Container, Row, Col, Card, Button, Form, InputGroup, 
  Navbar, Nav, Badge, NavDropdown 
} from "react-bootstrap";
import { FaLeaf, FaTruck, FaShieldAlt, FaClock, FaShoppingCart, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";

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
  const [cartCount, setCartCount] = useState(0);
  const [activeFoodTab, setActiveFoodTab] = useState("monan");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const foodSafetyData = {
    monan: [
      { title: "Lưỡi Heo Làm Món Gì Ngon?", img: "https://cdn.giaoducthoidai.vn/images/b4508baace0d9fe4c8bbd296e259642ea0ca5f9ecdf263bb917512e465f3d36f8f877887612d47c441e4a6a76afe9cd269bc6861a00ab3b7c6596180092f57d1b3a1a8824b2274e809aa9fa958e9f7fd/luoiheoluoctranggionthomngon4_TORG.jpg", desc1: "12+ món ngon từ lưỡi heo dễ làm", desc2: "Gợi ý món ngon cho bữa cơm gia đình" },
      { title: "Tép Khô Làm Món Gì Ngon?", img: "https://i.etsystatic.com/18882553/r/il/8f8fb4/6204804366/il_1080xN.6204804366_5bax.jpg", desc1: "14+ món ngon từ tép khô dân dã", desc2: "Những món ăn đậm vị quê hương" },
      { title: "Sườn Heo Nấu Gì Ngon?", img: "https://bing.com/th?id=OSK.b434f5edf7e8a343ac72cc07ce1d0c40", desc1: "10+ cách chế biến sườn heo hấp dẫn", desc2: "Từ kho, rim đến nướng đều ngon" },
      { title: "Thịt Gà Ta Làm Món Gì?", img: "https://bing.com/th?id=OSK.291539df032729f5906e855915cbd9f3", desc1: "15+ món ngon từ gà ta thả vườn", desc2: "Gà hấp, chiên, nướng chuẩn vị" }
    ],
    rausach: [
      { title: "Cách Nhận Biết Rau Sạch", img: "https://tgs.vn/wp-content/uploads/2022/09/rau-cai.jpg", desc1: "Phân biệt rau sạch và rau bẩn", desc2: "Bảo vệ sức khỏe gia đình bạn" },
      { title: "Lợi Ích Rau Hữu Cơ", img: "https://orifarm.vn/wp-content/uploads/2018/09/37781408_2114046418667682_8765224160243744768_o-765x1024.jpg", desc1: "Tại sao nên chọn rau hữu cơ?", desc2: "Tốt cho sức khỏe và môi trường" },
      { title: "Rửa Rau Sạch Như Thế Nào?", img: "https://tse4.mm.bing.net/th/id/OIP.O_zqAhhizfMoyK7xzkRBqgHaJQ?rs=1&pid=ImgDetMain&o=7&rm=3", desc1: "Mẹo rửa rau loại bỏ thuốc trừ sâu", desc2: "An toàn tuyệt đối cho bữa ăn" },
      { title: "Bảo Quản Rau Tươi Lâu", img: "https://media.phunutoday.vn/files/news/2025/03/24/5-cach-bao-quan-rau-tuoi-ngon-ca-tuan-rau-xanh-muot-khong-lo-heo-ua-115456.jpg", desc1: "Mẹo giữ rau tươi cả tuần", desc2: "Tiết kiệm và chống lãng phí" }
    ],
    suckhoe: [
      { title: "Ăn Uống Khoa Học", img: "https://th.bing.com/th/id/OIP.XxozmB9IIlSlAeFcNr3AtQHaFv?w=200&h=200&c=10&o=6&dpr=1.3&pid=genserp&rm=2", desc1: "Nguyên tắc ăn uống lành mạnh", desc2: "Cân bằng dinh dưỡng mỗi ngày" },
      { title: "Thực Phẩm Tốt Cho Tim Mạch", img: "https://tse2.mm.bing.net/th/id/OIP.t787wq1G6GOqMWlR90jI0AHaFj?rs=1&pid=ImgDetMain&o=7&rm=3", desc1: "Top thực phẩm bảo vệ tim mạch", desc2: "Giảm cholesterol tự nhiên" },
      { title: "Tăng Cường Miễn Dịch", img: "https://th.bing.com/th/id/OIP.Ux9tEWksqFD-uvXs2W2qzQHaFU?w=200&h=200&c=10&o=6&dpr=1.3&pid=genserp&rm=2", desc1: "Thực phẩm tăng sức đề kháng", desc2: "Phòng ngừa bệnh hiệu quả" },
      { title: "Detox Cơ Thể Tự Nhiên", img: "https://th.bing.com/th/id/OIP.y3HX3m8Bf4vUlFdKhIStbwHaE7?w=158&h=108&c=7&qlt=90&bgcl=d50edf&r=0&o=6&dpr=1.3&pid=13.1", desc1: "Cách thải độc cơ thể tại nhà", desc2: "Làm sạch từ bên trong" }
    ]
  };

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
      {/* HEADER - FIX ĐĂNG XUẤT + HIỂN THỊ USER */}
      <Navbar bg="white" expand="lg" className="shadow-sm py-3 sticky-top">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-success fs-3">
            Thực Phẩm Sạch
          </Navbar.Brand>

          <Form className="d-flex mx-auto" style={{ maxWidth: "500px" }} onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="success" type="submit">
                Tìm
              </Button>
            </InputGroup>
          </Form>

          <Nav className="align-items-center gap-3">
            {user ? (
              <>
                <span className="text-dark fw-medium">
                  Chào <strong>{user.hoten || user.ten_dangnhap}</strong> 🌿
                </span>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    logout();
                    alert("Đăng xuất thành công!");
                  }}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-dark d-flex align-items-center">
                  <FaUser className="me-1" /> Đăng Nhập
                </Nav.Link>
                <Button variant="outline-success" as={Link} to="/register">
                  Đăng Ký
                </Button>
              </>
            )}
            <Nav.Link as={Link} to="/cart" className="position-relative text-dark">
              <FaShoppingCart size={26} />
              {cartCount > 0 && (
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                  {cartCount}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* THANH NAVIGATION GIỮ NGUYÊN */}
      <Navbar bg="success" variant="dark" expand="lg" className="py-0 shadow-sm">
        <Container>
          <Navbar.Toggle aria-controls="main-navbar" className="border-0 text-white" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto text-uppercase fw-semibold gap-5">
              <Nav.Link as={Link} to="/" className="text-white py-3">
                Trang Chủ
              </Nav.Link>

              <NavDropdown 
                title="Sản Phẩm" 
                id="sanpham-dropdown" 
                menuVariant="dark"
                className="py-3"
              >
                {categories.map((cat) => (
                  <NavDropdown.Item
                    key={cat.title}
                    as={Link}
                    to={`/products?category=${cat.query}`}
                    className="text-white"
                  >
                    {cat.title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <Nav.Link as={Link} to="/tin-tuc" className="text-white py-3">
                Tin Tức
              </Nav.Link>

              <Nav.Link as={Link} to="/lien-he" className="text-white py-3">
                Liên Hệ
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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

      {/* SẢN PHẨM NỔI BẬT - FIX NÚT MUA */}
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
                          onClick={() => {
                            if (!user) {
                              navigate("/login");
                            } else {
                              alert("Đã thêm vào giỏ hàng!");
                            }
                          }}
                        >
                          <FaShoppingCart className="me-2" />
                          Thêm vào giỏ
                        </Button>
                        <Button
                          variant="success"
                          onClick={() => {
                            if (!user) {
                              navigate("/login");
                            } else {
                              alert("Chuyển đến thanh toán!");
                            }
                          }}
                        >
                          Mua ngay
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
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

      {/* AN TOÁN THÔNG TIN THỰC PHẨM GIỮ NGUYÊN */}
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
          {foodSafetyData[activeFoodTab].map((item, index) => (
            <Col lg={3} md={6} key={index}>
              <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                <div className="text-center pt-4">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="rounded-circle border border-4 border-success"
                    style={{ width: "140px", height: "140px", objectFit: "cover" }}
                  />
                </div>
                <Card.Body className="text-center pb-4">
                  <h5 className="fw-bold text-success mb-3">{item.title}</h5>
                  <p className="small text-muted mb-2">{item.desc1}</p>
                  <p className="text-secondary small">{item.desc2}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* HOVER EFFECT GIỮ NGUYÊN */}
      <style jsx>{`
        .product-card:hover {
          transform: translateY(-12px);
          transition: all 0.4s ease;
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
        .product-card img {
          transition: transform 0.5s ease;
        }
        .product-card:hover img {
          transform: scale(1.08);
        }
        .category-card:hover {
          transform: translateY(-12px);
          transition: all 0.4s ease;
          box-shadow: 0 20px 40px rgba(0,128,0,0.15) !important;
        }
        .category-card img {
          transition: transform 0.5s ease;
        }
        .category-card:hover img {
          transform: scale(1.08);
        }
      `}</style>

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