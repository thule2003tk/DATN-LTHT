import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Container, Row, Col, Card, Badge, Button
} from "react-bootstrap";
import {
  FaLeaf, FaTruck, FaShieldAlt, FaClock, FaThumbsUp, FaThumbsDown, FaShareAlt, FaTicketAlt
} from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllSanPham, getFeaturedProducts, getNewArrivals, getPromotionProducts } from "../api/sanpham";
import { getAllBlog, getBlogsByCategory } from "../api/blog";
import { getDanhMuc } from "../api/danhmuc";
import khuyenMaiApi from "../api/khuyenmai";
import { useAuth } from "../context/AuthContext";

import { getCategoryIcon } from "../utils/iconHelper";
import axiosClient from "../api/axiosClient";

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
  const [savedPromos, setSavedPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dynamicBanners, setDynamicBanners] = useState([]);
  const [newsData, setNewsData] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [sp, featured, newest, promo, allBlogs, km, catData, newsRes] = await Promise.all([
          getAllSanPham(),
          getFeaturedProducts(),
          getNewArrivals(),
          getPromotionProducts(),
          getAllBlog(),
          khuyenMaiApi.getActivePromos(),
          getDanhMuc(),
          axiosClient.get("/tintuc")
        ]);
        console.log("Home.jsx: Data nhận được từ bảng blog:", allBlogs);

        setNewsData(newsRes.data || []);

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
  }, [user]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axiosClient.get("/banners");
        setDynamicBanners(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Lỗi lấy banner:", err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchSaved = async () => {
      if (user) {
        try {
          const res = await khuyenMaiApi.getMinePromos();
          setSavedPromos(res.data?.map(p => p.ma_km) || []);
        } catch (err) {
          console.error("Lỗi lấy mã đã lưu:", err);
        }
      } else {
        setSavedPromos([]);
      }
    };
    fetchSaved();
  }, [user]);

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

  /* ================= PROMO LOGIC ================= */
  const handleSavePromo = async (code) => {
    try {
      await khuyenMaiApi.savePromo(code);
      setSavedPromos(prev => [...prev, code]);
      alert(`✅ Đã lưu mã ${code} vào kho của bạn!`);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("⚠️ Vui lòng đăng nhập để lưu mã khuyến mãi.");
      } else {
        alert(error.response?.data?.error || "❌ Lỗi khi lưu mã.");
      }
    }
  };

  /* ================= PRODUCT LOGIC ================= */
  const featured = featuredProducts;
  const newest = newArrivals;
  const promos_list = promotionProducts;

  const getDisplayPrice = (p) => {
    const originalPrice = Number(p.gia);
    const discount = Number(p.phan_tram_giam_gia || 0);
    if (discount > 0) {
      const discountedPrice = originalPrice * (1 - discount / 100);
      return (
        <div className="d-flex align-items-center flex-wrap">
          <span className="text-danger fw-bold fs-5 me-2">
            {discountedPrice.toLocaleString()}₫
          </span>
          <span className="text-muted text-decoration-line-through small">
            {originalPrice.toLocaleString()}₫
          </span>
        </div>
      );
    }
    return (
      <div className="text-success fw-bold fs-5">
        {originalPrice.toLocaleString()}₫
      </div>
    );
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
                      <Link to={`/products?category=${c.ma_danhmuc}`} className="d-flex align-items-center gap-2">
                        <span className="text-success">{getCategoryIcon(c.icon, c.ten_danhmuc)}</span>
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
              {dynamicBanners.map((b, i) => (
                <div key={i} className="banner-wrap">
                  <img
                    src={b.hinhanh?.startsWith("banner_") ? `http://localhost:3001/uploads/${b.hinhanh}` : `/images/${b.hinhanh}`}
                    className="main-banner-img"
                    alt="banner"
                  />
                  <div className="banner-content">
                    <h2 className="banner-title-unique">{b.title}</h2>
                    <p className="banner-desc-unique">{b.description}</p>
                    <button
                      className={`btn-unique btn-unique-${b.button_color}`}
                      onClick={() => navigate(b.link_path)}
                    >
                      {b.button_text}
                    </button>
                  </div>
                </div>
              ))}
            </Carousel>
          </Col>

          {/* ===== BANNER PHỤ ===== */}
          <Col lg={3} className="d-none d-lg-flex flex-column gap-3">
            <img src="/images/sub_banner_auth1.png" className="sub-banner rounded-3 shadow-sm w-100" alt="Nông sản tươi sạch HTFood" />
            <img src="/images/sub_banner_auth2.png" className="sub-banner rounded-3 shadow-sm w-100" alt="Sản phẩm truyền thống HTFood" />
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
                      className={`btn btn-sm w-100 d-flex align-items-center justify-content-center gap-2 ${savedPromos.includes(p.ma_km) ? "btn-secondary disabled" : "btn-success"
                        }`}
                      onClick={() => !savedPromos.includes(p.ma_km) && handleSavePromo(p.ma_km)}
                    >
                      <FaTicketAlt /> {savedPromos.includes(p.ma_km) ? "Đã lưu" : "Lưu mã"}
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
                    {p.phan_tram_giam_gia > 0 ? (
                      <Badge bg="danger" className="sale-badge position-absolute top-0 start-0 m-2">
                        -{p.phan_tram_giam_gia}%
                      </Badge>
                    ) : block.title.includes("KHUYẾN MÃI") && (
                      <Badge bg="warning" className="sale-badge position-absolute top-0 start-0 m-2">
                        KM
                      </Badge>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <h6 className="product-name mb-2 flex-grow-1">{p.ten_sp}</h6>
                    {getDisplayPrice(p)}
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
                  {p.phan_tram_giam_gia > 0 && (
                    <Badge bg="danger" className="sale-badge position-absolute top-0 start-0 m-2">
                      -{p.phan_tram_giam_gia}%
                    </Badge>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <h6 className="product-name mb-2 flex-grow-1">{p.ten_sp}</h6>
                  {getDisplayPrice(p)}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {/* ================= BLOG/KNOWLEDGE SECTION (KNOWLEDGE HUB) ================= */}
      {blogData.length > 0 && (
        <section className="knowledge-hub py-5 my-5">
          <Container>
            <div className="d-flex justify-content-between align-items-center mb-5 border-start border-4 border-success ps-4">
              <div>
                <h2 className="fw-bold text-dark mb-1">🥬 CẨM NANG SỐNG KHỎE</h2>
                <p className="text-secondary mb-0">Bí quyết chọn thực phẩm sạch và dinh dưỡng cho gia đình</p>
              </div>
              <Link to="/blog" className="btn btn-success px-4 py-2 rounded-pill shadow-sm fw-bold">
                XEM THÊM KIẾN THỨC
              </Link>
            </div>

            <Row className="g-4">
              {blogData.slice(0, 3).map((b) => (
                <Col lg={4} key={b.id}>
                  <Card className="border-0 bg-transparent knowledge-card h-100" onClick={() => navigate(`/blog/${b.id}`)} style={{ cursor: 'pointer' }}>
                    <div className="knowledge-img-wrap rounded-4 overflow-hidden shadow-sm mb-3">
                      <img
                        src={b.img?.startsWith("http") ? b.img : `http://localhost:3001/uploads/${b.img}`}
                        className="card-img-top knowledge-img"
                        alt={b.title}
                        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=HTFood+Blog"; }}
                      />
                      <div className="knowledge-tag">{b.category || "Dinh dưỡng"}</div>
                    </div>
                    <Card.Body className="p-0">
                      <div className="knowledge-date mb-2">{new Date(b.ngay_tao || Date.now()).toLocaleDateString("vi-VN")}</div>
                      <h5 className="fw-bold text-dark mb-3 knowledge-title h-100" title={b.title}>{b.title}</h5>
                      <p className="text-muted small mb-0 knowledge-desc">{b.desc1}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

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
          bottom: 12%;
          left: 6%;
          color: white;
          text-shadow: 0 2px 12px rgba(0,0,0,0.8);
          max-width: 80%;
          text-align: left;
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

        .sub-banner-link {
          transition: transform 0.3s ease;
          display: block;
        }
        .sub-banner-link:hover {
          transform: scale(1.03);
        }

        /* BANNER UNIQUE STYLING */
        .banner-title-unique {
          font-size: 3rem;
          font-weight: 800;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
          margin-bottom: 10px;
          animation: fadeInUp 0.8s ease;
        }
        .banner-desc-unique {
          font-size: 1.2rem;
          font-weight: 500;
          background: rgba(0,0,0,0.3);
          display: inline-block;
          padding: 5px 15px;
          border-radius: 50px;
          margin-bottom: 25px;
          animation: fadeInUp 1s ease;
        }
        .btn-unique {
          padding: 12px 35px;
          border-radius: 50px;
          font-weight: 700;
          text-transform: uppercase;
          border: none;
          letter-spacing: 1px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 1.2s ease;
        }
        .btn-unique:hover {
          transform: scale(1.1) translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
        }
        .btn-unique-success {
          background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
          color: white;
        }
        .btn-unique-danger {
          background: linear-gradient(135deg, #dc3545 0%, #a71d2a 100%);
          color: white;
        }
        .btn-unique-warning {
          background: linear-gradient(135deg, #ffc107 0%, #d39e00 100%);
          color: #212529;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Hiệu ứng trượt lấp lánh cho nút */
        .btn-unique::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 20%;
          height: 200%;
          background: rgba(255,255,255,0.3);
          transform: rotate(30deg);
          transition: none;
        }
        .btn-unique:hover::after {
          left: 120%;
          transition: all 0.6s ease;
        }

        /* News Home Section */
        .news-home-card {
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .news-home-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
        }
        .news-home-img-wrap {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        .news-home-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .news-home-card:hover .news-home-img {
          transform: scale(1.1);
        }
        .news-home-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          padding: 6px 15px;
          font-size: 0.75rem;
          border-radius: 5px;
        }
        .home-news-limit {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 3rem;
        }
        /* Knowledge Hub (Blog) Home Styles */
        .knowledge-hub {
          background-color: #f1f8f4;
          border-radius: 30px;
        }
        .knowledge-card {
           transition: all 0.3s ease;
        }
        .knowledge-img-wrap {
          position: relative;
          height: 240px;
          transition: transform 0.3s ease;
        }
        .knowledge-card:hover .knowledge-img-wrap {
          transform: translateY(-5px);
        }
        .knowledge-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .knowledge-tag {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: #fff;
          color: #28a745;
          padding: 4px 12px;
          border-radius: 5px;
          font-weight: 700;
          font-size: 0.75rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .knowledge-date {
          font-size: 0.8rem;
          color: #888;
          font-weight: 500;
        }
        .knowledge-title {
           font-size: 1.25rem;
           line-height: 1.4;
           transition: color 0.3s ease;
        }
        .knowledge-card:hover .knowledge-title {
          color: #28a745 !important;
        }
        .knowledge-desc {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>


    </>
  );
}