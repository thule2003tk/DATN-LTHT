import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Container, Row, Col, Card, Badge, Button
} from "react-bootstrap";
import {
  FaLeaf, FaTruck, FaShieldAlt, FaClock, FaThumbsUp, FaThumbsDown, FaShareAlt
} from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllSanPham, getFeaturedProducts, getNewArrivals, getPromotionProducts } from "../api/sanpham";
import { getAllBlog, getBlogsByCategory } from "../api/blog";
import { getDanhMuc } from "../api/danhmuc";
import khuyenMaiApi from "../api/khuyenmai";

/* ================= CONFIG ================= */
const bannerResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export default function Home() {
  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("monan");
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);

  const [promos, setPromos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [blogCategories, setBlogCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [sp, featured, newest, promo, allBlogs, km, catData] = await Promise.all([
          getAllSanPham(),
          getFeaturedProducts(),
          getNewArrivals(),
          getPromotionProducts(),
          getAllBlog(),
          khuyenMaiApi.getActivePromos(),
          getDanhMuc()
        ]);
        console.log("Home.jsx: Data nhận được từ bảng blog:", allBlogs);

        setAllProducts(sp || []);
        setFeaturedProducts(featured || []);
        setNewArrivals(newest || []);
        setPromotionProducts(promo || []);

        setPromos(km.data?.filter(p => p.trangthai === "Đang áp dụng") || []);
        setCategories(catData || []);

        // Dynamic Blogs
        const actualBlogs = Array.isArray(allBlogs) ? allBlogs : [];
        console.log("Home.jsx: Blogs thực tế sau khi kiểm tra array:", actualBlogs.length);
        setBlogData(actualBlogs);

        const uniqueCats = [...new Set(actualBlogs.map(b => b.category).filter(Boolean))];
        console.log("Home.jsx: Các danh mục blog từ DB:", uniqueCats);
        setBlogCategories(uniqueCats);

        if (uniqueCats.length > 0) {
          if (!activeTab || !uniqueCats.includes(activeTab)) {
            setActiveTab(uniqueCats[0]);
          }
        } else {
          console.warn("Home.jsx: Không lấy được dữ liệu bài viết (blogData trống).");
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogData.filter(b => b.category === activeTab).slice(0, 4);
  }, [blogData, activeTab]);

  const catLabel = (cat) => {
    const map = {
      monan: "Món Ăn",
      "mon-an": "Món Ăn",
      rausach: "Rau Sạch",
      "rau-sach": "Rau Sạch",
      suckhoe: "Sức Khỏe",
      "suc-khoe": "Sức Khỏe",
      tintuc: "Tin Tức",
      "tin-tuc": "Tin Tức",
      blog: "Blog Chia Sẻ"
    };
    return map[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  const img = (p) =>
    p.hinhanh?.startsWith("http")
      ? p.hinhanh
      : `http://localhost:3001/uploads/${p.hinhanh}`;

  /* ================= PRODUCT LOGIC ================= */
  const featured = featuredProducts;
  const newest = newArrivals;
  const promos_list = promotionProducts;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
  };

  if (loading) {
    return (
      <div className="text-center my-5 text-success fw-bold fs-4">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* ================= SIDEBAR + BANNER ================= */}
      <Container fluid className="mt-3">
        <Row className="gx-3">
          {/* ===== SIDEBAR ===== */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="category-box">
              <div className="category-title">☰ DANH MỤC</div>
              <ul className="category-list">
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <li key={c.ma_danhmuc}>
                      <Link to={`/products?category=${c.ma_danhmuc}`}>
                        {c.icon && <span className="me-2">{c.icon}</span>}
                        {c.ten_danhmuc}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-muted">Đang cập nhật...</li>
                )}
              </ul>
            </div>
          </Col>

          {/* ===== BANNER ===== */}
          <Col lg={6}>
            <Carousel responsive={bannerResponsive} autoPlay infinite showDots>
              {["/images/banner1.jpg", "/images/banner2.jpg"].map((b, i) => (
                <div key={i} className="banner-wrap">
                  <img src={b} className="main-banner-img" alt="banner" />
                  <div className="banner-content">
                    <h2>THỰC PHẨM SẠCH</h2>
                    <p>Giảm đến 20% hôm nay</p>
                    <button className="btn btn-danger">Mua ngay</button>
                  </div>
                </div>
              ))}
            </Carousel>
          </Col>

          {/* ===== BANNER PHỤ ===== */}
          <Col lg={3} className="d-none d-lg-flex flex-column gap-3">
            <img src="/images/banner2.jpg" className="sub-banner" alt="Banner phụ 1" />
            <img src="/images/banner3.jpg" className="sub-banner" alt="Banner phụ 2" />
          </Col>
        </Row>
      </Container>

      {/* ================= KHUYẾN MÃI ================= */}
      {promos.length > 0 && (
        <Container className="my-5">
          <h4 className="fw-bold text-success mb-4">🎁 MÃ GIẢM GIÁ DÀNH CHO BẠN</h4>
          <Row className="g-3">
            {promos.map((p) => (
              <Col md={3} key={p.ma_km}>
                <div className="promo-ticket d-flex align-items-center bg-white shadow-sm rounded-3 overflow-hidden">
                  <div className="promo-left bg-success text-white p-3 text-center">
                    <div className="fw-bold fs-5">{p.mucgiam}%</div>
                    <small>OFF</small>
                  </div>
                  <div className="promo-right p-3 flex-grow-1">
                    <div className="fw-bold text-dark mb-1">{p.ma_km}</div>
                    <div className="small text-muted mb-2">Đơn từ {Number(p.giatri_don).toLocaleString()}₫</div>
                    <button
                      className="btn btn-outline-success btn-sm w-100"
                      onClick={() => handleCopyCode(p.ma_km)}
                    >
                      Sao chép mã
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      )}

      {/* ================= LỢI ÍCH ================= */}
      <Container className="my-5 bg-light rounded-4 py-4 shadow-sm">
        <Row className="text-center">
          {[
            { icon: FaLeaf, text: "Hữu Cơ" },
            { icon: FaTruck, text: "Giao Nhanh" },
            { icon: FaShieldAlt, text: "VietGAP" },
            { icon: FaClock, text: "Tươi Mỗi Ngày" },
          ].map((item, i) => (
            <Col md={3} key={i}>
              <item.icon size={42} className="text-success mb-2" />
              <h6 className="fw-bold">{item.text}</h6>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ================= BLOCK PRODUCT ================= */}
      {[
        { title: "⭐ SẢN PHẨM NỔI BẬT", data: featured },
        { title: "🆕 SẢN PHẨM MỚI", data: newest },
        { title: "🎁 SẢN PHẨM KHUYẾN MÃI", data: promos_list },
      ].map((block, idx) => (
        <Container className="my-5" key={idx}>
          <h4 className="fw-bold text-success mb-4">{block.title}</h4>
          <Row className="g-4">
            {block.data.map((p) => (
              <Col lg={2} md={3} sm={4} xs={6} key={p.ma_sp}>
                <Card
                  className="product-card h-100 border-0 shadow-sm"
                  onClick={() => navigate(`/product/${p.ma_sp}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-img position-relative">
                    <img src={img(p)} alt={p.ten_sp} className="card-img-top" />
                    {block.title.includes("KHUYẾN MÃI") && (
                      <Badge bg="danger" className="sale-badge position-absolute top-0 start-0 m-2">
                        Giảm
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <h6 className="product-name mb-2 flex-grow-1">{p.ten_sp}</h6>
                    <div className="price text-success fw-bold">
                      {Number(p.gia).toLocaleString()}₫
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ))}

      {/* ================= TẤT CẢ SẢN PHẨM ================= */}
      <Container className="my-5">
        <h4 className="fw-bold text-success mb-4">📦 TẤT CẢ SẢN PHẨM</h4>
        <Row className="g-4">
          {allProducts.map((p) => (
            <Col lg={2} md={3} sm={4} xs={6} key={p.ma_sp}>
              <Card
                className="product-card h-100 border-0 shadow-sm"
                onClick={() => navigate(`/product/${p.ma_sp}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-img position-relative">
                  <img src={img(p)} alt={p.ten_sp} className="card-img-top" />
                </div>
                <Card.Body className="d-flex flex-column">
                  <h6 className="product-name mb-2 flex-grow-1">{p.ten_sp}</h6>
                  <div className="price text-success fw-bold">
                    {Number(p.gia).toLocaleString()}₫
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {/* ================= BLOG SECTION ================= */}
      <Container className="my-5">
        <div className="bg-white rounded-4 shadow-sm p-4">
          <h3 className="text-center fw-bold text-success mb-4">
            AN TOÀN THÔNG TIN THỰC PHẨM
          </h3>

          {/* ===== TABS (DYNAMIC) ===== */}
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                className={`btn ${activeTab === cat ? "btn-success" : "btn-outline-success"
                  } rounded-pill px-4`}
                onClick={() => setActiveTab(cat)}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>

          {/* ===== CONTENT (MOSAIC GRID) ===== */}
          <Row className="g-4">
            {filteredBlogs.length > 0 ? (
              <>
                {/* LARGE FEATURED CARD */}
                <Col lg={7} md={12}>
                  <Card
                    className="h-100 border-0 shadow-sm blog-card-portal featured"
                    onClick={() => navigate(`/blog/${filteredBlogs[0].id}`)}
                  >
                    <div className="blog-img-wrap featured position-relative">
                      <img
                        src={filteredBlogs[0].img?.startsWith("http") ? filteredBlogs[0].img : `http://localhost:3001/uploads/${filteredBlogs[0].img || "placeholder.jpg"}`}
                        alt={filteredBlogs[0].title}
                        className="blog-img-main"
                      />
                      <div className="portal-source-badge featured">
                        <img src="/logo192.png" alt="source" width="20" className="me-2" />
                        THỰC PHẨM SẠCH • 2 giờ trước
                      </div>
                    </div>
                    <Card.Body className="p-4 d-flex flex-column">
                      <h4 className="fw-bold mb-3 portal-title featured">
                        {filteredBlogs[0].title}
                      </h4>
                      <p className="text-muted mb-4 featured-desc">
                        {filteredBlogs[0].content?.replace(/<[^>]*>?/gm, "").substring(0, 250)}...
                      </p>
                      <div className="mt-auto d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-4">
                          <span className="reaction-stat"><FaThumbsUp className="me-1" /> {Math.floor(Math.random() * 50) + 10}</span>
                          <span className="reaction-stat"><FaThumbsDown className="me-1" /></span>
                        </div>
                        <FaShareAlt className="text-muted" />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* SECONDARY CARDS LIST */}
                <Col lg={5} md={12}>
                  <div className="d-flex flex-column gap-4 h-100">
                    {filteredBlogs.slice(1, 4).map((b, idx) => (
                      <Card
                        key={b.id}
                        className="border-0 shadow-sm blog-card-portal horizontal"
                        onClick={() => navigate(`/blog/${b.id}`)}
                      >
                        <Row className="g-0 h-100">
                          <Col xs={4}>
                            <div className="blog-img-wrap horizontal">
                              <img
                                src={b.img?.startsWith("http") ? b.img : `http://localhost:3001/uploads/${b.img || "placeholder.jpg"}`}
                                alt={b.title}
                                className="blog-img-main"
                              />
                            </div>
                          </Col>
                          <Col xs={8}>
                            <Card.Body className="p-3">
                              <div className="portal-source-small mb-2">
                                TPS News • {idx + 1} ngày trước
                              </div>
                              <h6 className="fw-bold mb-2 portal-title small-card">
                                {b.title}
                              </h6>
                              <div className="d-flex align-items-center justify-content-between x-small text-muted mt-2">
                                <div className="d-flex gap-3">
                                  <span><FaThumbsUp className="me-1" /> {Math.floor(Math.random() * 20)}</span>
                                  <span><FaShareAlt /></span>
                                </div>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                  </div>
                </Col>
              </>
            ) : (
              <div className="text-center text-muted py-5 w-100">
                <div className="mb-3 fs-1 text-light-success opacity-50">🍃</div>
                Chưa có bài viết nào trong mục này.
              </div>
            )}
          </Row>
        </div>
      </Container>

      <Footer />

      {/* ================= CSS ================= */}
      <style>{`
        body { background: #f8f9fa; }
        
        /* Sidebar & Categories */
        .category-box {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .category-title {
          background: #28a745;
          color: white;
          padding: 14px 16px;
          font-weight: 700;
          font-size: 1.1rem;
        }
        .category-list { list-style: none; padding: 0; margin: 0; }
        .category-list li {
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          transition: all 0.2s;
        }
        .category-list li:hover {
          background: #e8f5e9;
          color: #28a745;
        }
        .category-list a {
          text-decoration: none;
          color: #333;
          font-size: 0.95rem;
        }

        /* Banner */
        .banner-wrap { position: relative; }
        .main-banner-img {
          width: 100%;
          height: 420px;
          object-fit: cover;
          border-radius: 12px;
        }
        .banner-content {
          position: absolute;
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          color: white;
          text-shadow: 0 2px 8px rgba(0,0,0,0.6);
        }
        .sub-banner {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
        }

        /* Products */
        .product-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.15) !important;
        }
        .product-img {
          height: 180px;
          overflow: hidden;
        }
        .product-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-img img {
          transform: scale(1.08);
        }
        .sale-badge {
          font-size: 0.8rem;
          padding: 4px 10px;
        }
        .product-name {
          font-size: 0.95rem;
          line-height: 1.4;
          color: #333;
          font-weight: 600;
        }
        .price {
          font-size: 1.1rem;
          font-weight: 800;
        }

        /* BLOG PORTAL REDESIGN */
        .blog-card-portal {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
          background: white;
          border: 1px solid rgba(0,0,0,0.08) !important;
        }
        .blog-card-portal:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        .blog-img-wrap.featured { height: 400px; }
        .blog-img-wrap.horizontal { height: 100%; min-height: 120px; }
        
        .blog-img-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);
        }
        .blog-card-portal:hover .blog-img-main { transform: scale(1.05); }

        .portal-source-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: rgba(255,255,255,0.9);
          padding: 6px 15px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          color: #333;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .portal-source-small {
          font-size: 0.7rem;
          color: #dc3545;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .portal-title {
          color: #1a1a1a;
          transition: color 0.2s;
        }
        .portal-title.featured { font-size: 1.8rem; line-height: 1.2; }
        .portal-title.small-card { 
          font-size: 1rem; 
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .blog-card-portal:hover .portal-title { color: #28a745; }

        .featured-desc {
          font-size: 1rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .reaction-stat {
          font-size: 0.85rem;
          font-weight: 600;
          color: #555;
        }

        @media (max-width: 991px) {
          .blog-img-wrap.featured { height: 300px; }
          .portal-title.featured { font-size: 1.4rem; }
        }
        
        .promo-ticket { border: 1px dashed #28a745; }
        .x-small { font-size: 0.75rem; }
      `}</style>


    </>
  );
}