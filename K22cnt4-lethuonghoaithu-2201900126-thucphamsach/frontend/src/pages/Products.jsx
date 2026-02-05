import { useEffect, useState } from "react";
import { getAllSanPham } from "../api/sanpham.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axiosClient from "../api/axiosClient";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Badge,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { FaLeaf, FaShoppingCart, FaCheckCircle } from "react-icons/fa";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import Footer from "../components/Footer.jsx";
import { getCategoryIcon } from "../utils/iconHelper";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeBanners, setActiveBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get("category");
  const searchQuery = searchParams.get("search");

  const currentCategoryObj = categories.find(c => String(c.ma_danhmuc) === String(categoryQuery));
  const currentCategoryTitle = currentCategoryObj ? currentCategoryObj.ten_danhmuc : (categoryQuery ? "Loại sản phẩm" : "Tất Cả Sản Phẩm");

  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [sortBy, setSortBy] = useState("latest");

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { getDanhMuc } = await import("../api/danhmuc");
        const [prodData, catData, bannerData] = await Promise.all([
          getAllSanPham(),
          getDanhMuc(),
          axiosClient.get("/banners")
        ]);
        setProducts(prodData);
        setCategories(catData);
        setActiveBanners(bannerData.data.filter(b => b.type === "category") || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Search Input from URL
  useEffect(() => {
    setSearchTerm(searchQuery ? decodeURIComponent(searchQuery) : "");
  }, [searchQuery]);

  // Combined Filter & Sort Logic
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (categoryQuery) {
      filtered = filtered.filter(p => {
        const idMatches = p.danhmuc_ids && p.danhmuc_ids.includes(String(categoryQuery));
        const mainIdMatches = String(p.ma_danhmuc) === String(categoryQuery);
        return idMatches || mainIdMatches;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(p =>
        (p.ten_sp && p.ten_sp.toLowerCase().includes(term)) ||
        (p.ten_danhmuc && p.ten_danhmuc.toLowerCase().includes(term))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const getFinalPrice = (p) => {
        const price = Number(p.gia);
        const discount = Number(p.phan_tram_giam_gia || 0);
        return discount > 0 ? price * (1 - discount / 100) : price;
      };

      if (sortBy === "price_asc") {
        return getFinalPrice(a) - getFinalPrice(b);
      } else if (sortBy === "price_desc") {
        return getFinalPrice(b) - getFinalPrice(a);
      } else {
        // latest (by ma_sp or created_at if available)
        return b.ma_sp - a.ma_sp;
      }
    });

    setFilteredProducts(filtered);
  }, [categoryQuery, searchTerm, products, sortBy]);

  const currentBanner = activeBanners.find(b => {
    if (!categoryQuery) return b.link_path === "/products";
    return b.link_path.includes(`category=${categoryQuery}`);
  }) || activeBanners.find(b => b.link_path === "/products");

  const img = (p) =>
    p.hinhanh?.startsWith("http")
      ? p.hinhanh
      : `http://localhost:3001/uploads/${p.hinhanh}`;

  const getPriceUI = (p) => {
    const originalPrice = Number(p.gia);
    const discount = Number(p.phan_tram_giam_gia || 0);
    if (discount > 0) {
      const discountedPrice = originalPrice * (1 - discount / 100);
      return (
        <div className="d-flex align-items-center flex-wrap mt-2">
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
      <div className="text-success fw-bold fs-5 mt-2">
        {originalPrice.toLocaleString()}₫
      </div>
    );
  };

  const handleAddToCart = (e, p) => {
    e.stopPropagation();
    if (!user) return navigate("/login");
    const finalPrice = p.phan_tram_giam_gia > 0 ? Number(p.gia) * (1 - p.phan_tram_giam_gia / 100) : Number(p.gia);
    addToCart({ ...p, gia: finalPrice });
    setToastMsg(`Đã thêm "${p.ten_sp}" vào giỏ hàng!`);
    setShowToast(true);
  };

  return (
    <div className="bg-light min-vh-100">
      <Header />
      {loading ? (
        <div className="text-center my-5 py-5 text-success min-vh-100 d-flex align-items-center justify-content-center">
          <div className="spinner-border me-2"></div>
          <h4>Đang tải sản phẩm...</h4>
        </div>
      ) : (
        <>
          {/* Hero Banner Section */}
          {currentBanner && (
            <section className="category-hero position-relative overflow-hidden mb-5 pt-4">
              <Container>
                <div className="hero-banner-wrap rounded-4 shadow-sm overflow-hidden position-relative animate-fade-in" style={{ height: '350px' }}>
                  <img
                    src={currentBanner.hinhanh?.startsWith("banner_") ? `http://localhost:3001/uploads/${currentBanner.hinhanh}` : `/images/${currentBanner.hinhanh}`}
                    className="w-100 h-100 object-fit-cover shadow-img"
                    alt="Category Banner"
                  />
                  <div className="hero-overlay p-5 d-flex flex-column justify-content-center">
                    <h1 className="display-4 fw-bold text-white mb-3 text-shadow animate-slide-in-left">{currentBanner.title}</h1>
                    <p className="fs-5 text-white opacity-90 mb-0 text-shadow max-w-600 animate-slide-in-left-delay">{currentBanner.description}</p>
                  </div>
                  <div className="breadcrumb-overlay position-absolute bottom-0 start-0 p-3 ps-4">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link to="/" className="text-white text-decoration-none">Trang chủ</Link></li>
                        <li className="breadcrumb-item active text-white fw-bold" aria-current="page">{currentCategoryTitle}</li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </Container>
            </section>
          )}

          <Container className={`${currentBanner ? 'pb-5 mt-n5' : 'py-5'} position-relative`} style={{ zIndex: 10 }}>
            {!currentBanner && (
              <div className="mb-4">
                <h1 className="fw-bold text-success mb-2">{currentCategoryTitle}</h1>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Trang chủ</Link></li>
                    <li className="breadcrumb-item active text-dark fw-bold" aria-current="page">{currentCategoryTitle}</li>
                  </ol>
                </nav>
              </div>
            )}
            <Row className="gx-4">
              {/* Sidebar Filters */}
              <Col lg={3} className="d-none d-lg-block">
                <div className="filter-sidebar sticky-top" style={{ top: '100px' }}>
                  <Card className="border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                    <Card.Header className="bg-success text-white fw-bold py-3 border-0 d-flex align-items-center">
                      <FaLeaf className="me-2" /> DANH MỤC SẢN PHẨM
                    </Card.Header>
                    <Card.Body className="p-0">
                      <div className="list-group list-group-flush">
                        <Link
                          to="/products"
                          className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-2 ${!categoryQuery ? "bg-success bg-opacity-10 text-success fw-bold border-start border-4 border-success" : "text-dark"}`}
                        >
                          Tất cả sản phẩm
                        </Link>
                        {categories.map(c => (
                          <Link
                            key={c.ma_danhmuc}
                            to={`/products?category=${c.ma_danhmuc}`}
                            className={`list-group-item list-group-item-action border-0 px-4 py-3 d-flex align-items-center gap-2 ${categoryQuery === String(c.ma_danhmuc) ? "bg-success bg-opacity-10 text-success fw-bold border-start border-4 border-success" : "text-dark"}`}
                          >
                            <span className="fs-5 text-success">{getCategoryIcon(c.icon, c.ten_danhmuc)}</span>
                            {c.ten_danhmuc}
                          </Link>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>

                </div>
              </Col>

              {/* Product Grid */}
              <Col lg={9}>
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom bg-white p-3 rounded-4 shadow-sm">
                  <h5 className="mb-0 fw-bold text-dark">Tìm thấy <span className="text-success">{filteredProducts.length}</span> sản phẩm</h5>
                  <div className="d-flex gap-2">
                    <Form.Select
                      size="sm"
                      className="rounded-pill px-3 border-success-subtle shadow-none"
                      style={{ width: '180px' }}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="latest">Mới nhất</option>
                      <option value="price_asc">Giá thấp đến cao</option>
                      <option value="price_desc">Giá cao đến thấp</option>
                    </Form.Select>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                    <div className="display-1 mb-3">📦</div>
                    <h4 className="text-muted mb-4">Rất tiếc! Không tìm thấy sản phẩm nào phù hợp</h4>
                    <Button variant="success" className="rounded-pill px-4 py-2 fw-bold" onClick={() => navigate("/products")}>
                      Quay lại xem tất cả
                    </Button>
                  </div>
                ) : (
                  <Row className="g-4">
                    {filteredProducts.map((p) => (
                      <Col lg={4} md={6} sm={6} xs={6} key={p.ma_sp}>
                        <Card
                          className="product-card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative animate-fade-in-up"
                          onClick={() => navigate(`/product/${p.ma_sp}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="product-img-wrap position-relative">
                            <img
                              src={img(p)}
                              alt={p.ten_sp}
                              className="card-img-top p-image"
                              onError={(e) => (e.target.src = "/no-image.png")}
                            />
                            {p.phan_tram_giam_gia > 0 && (
                              <div className="sale-badge-v2">-{p.phan_tram_giam_gia}%</div>
                            )}
                            {Number(p.soluong_ton) <= 0 && (
                              <div className="out-of-stock-overlay">
                                <Badge bg="secondary" className="px-3 py-2 fs-6">HẾT HÀNG</Badge>
                              </div>
                            )}
                          </div>
                          <Card.Body className="d-flex flex-column p-4">
                            <div className="text-muted small mb-1 fw-medium">{p.ten_dm_chinh || p.ten_danhmuc}</div>
                            <h6 className="product-title fw-bold mb-0 flex-grow-1 text-dark">{p.ten_sp}</h6>
                            {getPriceUI(p)}

                            <div className="product-action-btns mt-3 d-flex gap-2">
                              <Button
                                variant="outline-success"
                                className="flex-grow-1 rounded-pill action-btn-add d-flex align-items-center justify-content-center"
                                disabled={Number(p.soluong_ton) <= 0}
                                onClick={(e) => handleAddToCart(e, p)}
                              >
                                <FaShoppingCart size={14} />
                              </Button>
                              <Button
                                variant="success"
                                className="flex-grow-1 rounded-pill action-btn-buy fw-bold small"
                                disabled={Number(p.soluong_ton) <= 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!user) return navigate("/login");
                                  const finalPrice = p.phan_tram_giam_gia > 0 ? Number(p.gia) * (1 - p.phan_tram_giam_gia / 100) : Number(p.gia);
                                  navigate("/checkout", { state: { buyNowItem: { ...p, gia: finalPrice, quantity: 1 } } });
                                }}
                              >
                                MUA NGAY
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Container>



          {/* Toast Notification */}
          <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="border-0 shadow-lg rounded-3">
              <Toast.Header closeButton={false} className="bg-success text-white border-0 py-2">
                <FaCheckCircle className="me-2" />
                <strong className="me-auto">Thông báo</strong>
                <small>Vừa xong</small>
              </Toast.Header>
              <Toast.Body className="bg-white py-3 fw-medium">
                {toastMsg}
              </Toast.Body>
            </Toast>
          </ToastContainer>

          <style>{`
        .hero-banner-wrap { position: relative; }
        .hero-overlay {
          position: absolute;
          top: 0; left: 0; bottom: 0; 
          width: 70%;
          background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
          z-index: 2;
        }
        .text-shadow { text-shadow: 0 4px 15px rgba(0,0,0,0.6); }
        .max-w-600 { max-width: 600px; }
        .object-fit-cover { object-fit: cover; }
        
        .product-card {
           transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
        }
        .product-img-wrap {
          height: 250px;
          overflow: hidden;
        }
        .p-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }
        .product-card:hover .p-image { transform: scale(1.1); }
        
        .sale-badge-v2 {
          position: absolute;
          top: 15px; left: 15px;
          background: #dc3545;
          color: white;
          padding: 4px 14px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.8rem;
          z-index: 5;
          box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
        }

        .out-of-stock-overlay {
          position: absolute;
          top:0; left:0; width:100%; height:100%;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 6;
          backdrop-filter: blur(2px);
        }

        .product-title {
          font-size: 1.05rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .action-btn-add, .action-btn-buy {
          transition: all 0.3s ease;
          padding: 12px !important;
        }
        .action-btn-add:hover { background-color: #198754; color: white !important; }

        /* Animations */
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-left-delay { animation: slideInLeft 0.8s ease-out 0.2s both; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out both; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 991px) {
          .category-hero { pt-0; }
          .hero-banner-wrap { height: 280px !important; border-radius: 0 !important; }
          .hero-overlay { width: 100%; background: rgba(0,0,0,0.5); text-align: center; }
          .max-w-600 { margin: 0 auto; }
          .product-img-wrap { height: 180px; }
        }
      `}</style>
        </>
      )}
      <Footer />
    </div>
  );
}

export default Products;
