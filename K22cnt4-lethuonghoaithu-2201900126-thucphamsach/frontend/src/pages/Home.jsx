import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Header from "../components/Header";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import {
  FaLeaf, FaTruck, FaShieldAlt, FaClock,
  FaShoppingCart
} from "react-icons/fa";

import { getAllSanPham } from "../api/sanpham";
import { getBlogsByCategory } from "../api/blog";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/* ================= SLIDER CONFIG ================= */
const bannerResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const productResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState({ monan: [], rausach: [], suckhoe: [] });
  const [activeTab, setActiveTab] = useState("monan");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [sp, monan, rausach, suckhoe] = await Promise.all([
          getAllSanPham(),
          getBlogsByCategory("monan"),
          getBlogsByCategory("rausach"),
          getBlogsByCategory("suckhoe"),
        ]);
        setProducts(sp || []);
        setBlogs({ monan, rausach, suckhoe });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  /* ================= DATA ================= */
  const categories = [
    { title: "Rau Củ Quả", query: "rau-cu" },
    { title: "Đồ Khô", query: "do-kho" },
    { title: "Sản Phẩm Tươi Sống", query: "tuoi-song" },
    { title: "Dược Liệu", query: "duoc-lieu" },
    { title: "Hạt Giống", query: "hat-giong" },
    { title: "Thực Phẩm Chế Biến", query: "che-bien" },
  ];

  const banners = [
    "https://img.pikbest.com/templates/20240706/fruit-fruit-banner-for-supermarket-store-green-background_10654794.jpg!bw700",
    "https://file.hstatic.net/200000271661/article/untitled-5-recovered_7b4bb62c75a5459e8b4ddd83ebbcc7df_grande.png",
  ];

  const img = (p) =>
    p.hinhanh?.startsWith("http")
      ? p.hinhanh
      : `http://localhost:3001/uploads/${p.hinhanh}`;

  /* ================= PHÂN LOẠI ================= */
  const saleProducts = products.slice(0, 6);
  const featuredProducts = products.slice(6, 14);

  if (loading) {
    return <div className="text-center my-5 text-success fw-bold">Đang tải dữ liệu…</div>;
  }

  return (
    <>
      <Header categories={categories} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* ================= SIDEBAR + BANNER ================= */}
      <Container className="mt-4">
        <div className="home-top">
          <aside className="sidebar">
            <div className="sidebar-title">☰ Chuyên mục</div>
            <ul>
              {categories.map((c, i) => (
                <li key={i}>
                  <Link to={`/products?category=${c.query}`}>{c.title}</Link>
                  <span>›</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="banner">
            <Carousel responsive={bannerResponsive} autoPlay infinite showDots arrows={false}>
              {banners.map((b, i) => (
                <img key={i} src={b} alt="" />
              ))}
            </Carousel>
          </div>
        </div>
      </Container>

      {/* ================= LỢI ÍCH ================= */}
      <Container className="my-5 bg-light rounded-4 py-4">
        <Row className="text-center">
          {[FaLeaf, FaTruck, FaShieldAlt, FaClock].map((Icon, i) => (
            <Col md={3} key={i}>
              <Icon size={48} className="text-success mb-2" />
              <h6 className="fw-bold">
                {["100% Hữu Cơ", "Giao Nhanh", "VietGAP", "Tươi Mỗi Ngày"][i]}
              </h6>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ================= KHUYẾN MÃI ================= */}
      <Container className="my-5">
        <h4 className="fw-bold text-success mb-3">🔥 SẢN PHẨM KHUYẾN MÃI</h4>
        <Carousel responsive={productResponsive}>
          {saleProducts.map(p => (
            <Card key={p.ma_sp} className="product-card mx-2">
              <div className="sale-badge">-20%</div>
              <img src={img(p)} />
              <Card.Body>
                <h6>{p.ten_sp}</h6>
                <p className="price-old">{Number(p.gia).toLocaleString()}₫</p>
                <p className="price-new">
                  {(p.gia * 0.8).toLocaleString()}₫
                </p>
                <Button
                  variant="success"
                  onClick={() => (!user ? navigate("/login") : addToCart(p))}
                >
                  <FaShoppingCart /> Mua ngay
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Carousel>
      </Container>

      {/* ================= SẢN PHẨM NỔI BẬT ================= */}
      <Container className="my-5">
        <h4 className="fw-bold text-success mb-3">⭐ SẢN PHẨM NỔI BẬT</h4>
        <Row className="g-4">
          {featuredProducts.map(p => (
            <Col md={3} key={p.ma_sp}>
              <Card className="product-card">
                <img src={img(p)} />
                <Card.Body>
                  <h6>{p.ten_sp}</h6>
                  <p className="price-new">{Number(p.gia).toLocaleString()}₫</p>
                  <Button
                    variant="outline-success"
                    className="w-100"
                    onClick={() => (!user ? navigate("/login") : addToCart(p))}
                  >
                    <FaShoppingCart /> Thêm vào giỏ
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ================= AN TOÀN THỰC PHẨM ================= */}
      <Container className="my-5 bg-light rounded-4 py-5">
        <h3 className="text-center fw-bold text-success mb-4">AN TOÀN THỰC PHẨM</h3>
        <div className="text-center mb-4">
          {["monan", "rausach", "suckhoe"].map(t => (
            <Button
              key={t}
              variant={activeTab === t ? "success" : "outline-success"}
              className="mx-2"
              onClick={() => setActiveTab(t)}
            >
              {t === "monan" ? "MÓN ĂN" : t === "rausach" ? "RAU SẠCH" : "SỨC KHỎE"}
            </Button>
          ))}
        </div>

        <Row className="g-4">
          {blogs[activeTab].map(b => (
            <Col md={3} key={b.id}>
              <Link to={`/blog/${b.id}`} className="text-decoration-none">
                <Card className="blog-card text-center">
                  <img src={b.img} />
                  <Card.Body>
                    <h6>{b.title}</h6>
                    <p className="small text-muted">{b.desc1}</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* ================= CSS ================= */}
      <style>{`
        .home-top{display:grid;grid-template-columns:260px 1fr;gap:18px}
        .sidebar{background:#fff;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,.08)}
        .sidebar-title{background:#2e7d32;color:#fff;padding:14px;font-weight:700}
        .sidebar li{display:flex;justify-content:space-between;padding:12px 16px;border-bottom:1px solid #eee;transition:.3s}
        .sidebar li:hover{background:#f4fbf6;padding-left:24px}
        .banner{border-radius:18px;overflow:hidden;box-shadow:0 12px 32px rgba(0,0,0,.15)}
        .banner img{width:100%;height:420px;object-fit:cover}

        .product-card{border:none;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);transition:.35s}
        .product-card:hover{transform:translateY(-10px)}
        .product-card img{height:220px;object-fit:cover}

        .sale-badge{position:absolute;top:12px;left:12px;background:#e53935;color:#fff;padding:6px 12px;border-radius:999px}
        .price-old{text-decoration:line-through;color:#999}
        .price-new{color:#2e7d32;font-weight:800}

        .blog-card{border:none;border-radius:18px;box-shadow:0 10px 25px rgba(0,0,0,.12);transition:.35s}
        .blog-card:hover{transform:translateY(-8px)}
        .blog-card img{width:140px;height:140px;border-radius:50%;margin:20px auto 0;border:4px solid #2e7d32}

        @media(max-width:992px){
          .home-top{grid-template-columns:1fr}
          .sidebar{display:none}
          .banner img{height:260px}
        }
      `}</style>
    </>
  );
}
