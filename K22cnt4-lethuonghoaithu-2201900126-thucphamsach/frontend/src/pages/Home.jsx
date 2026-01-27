import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {
  Container, Row, Col, Card, Badge
} from "react-bootstrap";
import {
  FaLeaf, FaTruck, FaShieldAlt, FaClock
} from "react-icons/fa";

import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllSanPham } from "../api/sanpham";
import { getBlogsByCategory } from "../api/blog";
import { useAuth } from "../context/AuthContext";

/* ================= CONFIG ================= */
const bannerResponsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const CATEGORIES = [
  "Rau Củ Quả",
  "Hoa Quả Tươi",
  "Thịt Sạch",
  "Hải Sản",
  "Đồ Khô",
  "Thực Phẩm Theo Mùa",
  "Super Sale",
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [blogs, setBlogs] = useState({ monan: [], rausach: [], suckhoe: [] });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const [sp, monan, rausach, suckhoe] = await Promise.all([
          getAllSanPham(),
          getBlogsByCategory("monan"),
          getBlogsByCategory("rausach"),
          getBlogsByCategory("suckhoe"),
        ]);
        setProducts(sp || []);
        setBlogs({
          monan: monan?.slice(0, 4) || [],
          rausach: rausach?.slice(0, 4) || [],
          suckhoe: suckhoe?.slice(0, 4) || [],
        });
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const img = (p) =>
    p.hinhanh?.startsWith("http")
      ? p.hinhanh
      : `http://localhost:3001/uploads/${p.hinhanh}`;

  /* ================= PRODUCT LOGIC ================= */
  const featured = useMemo(() => products.slice(0, 10), [products]);
  const newest = useMemo(() => [...products].reverse().slice(0, 10), [products]);
  const allProducts = products;

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
                {CATEGORIES.map((c, i) => (
                  <li key={i}>
                    <Link to="/products">{c}</Link>
                  </li>
                ))}
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
            <img src="/images/banner-small1.jpg" className="sub-banner" alt="sub-banner1" />
            <img src="/images/banner-small2.jpg" className="sub-banner" alt="sub-banner2" />
          </Col>
        </Row>
      </Container>

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
                    <Badge bg="danger" className="sale-badge position-absolute top-0 start-0 m-2">
                      Giảm
                    </Badge>
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

      <Footer />

      {/* ================= CSS ================= */}
      <style>{`
        body { background: #f8f9fa; }
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
        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
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
      `}</style>
    </>
  );
}