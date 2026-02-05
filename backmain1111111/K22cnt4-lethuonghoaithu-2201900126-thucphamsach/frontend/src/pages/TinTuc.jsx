import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { FaNewspaper, FaGlobeAmericas, FaFlag, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "../api/axiosClient";

function TinTuc() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosClient.get("/tintuc");
        setNews(res.data || []);
      } catch (err) {
        console.error("Lỗi lấy tin tức:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const img = (n) =>
    n.hinh_anh?.startsWith("http") ? n.hinh_anh : `http://localhost:3001/uploads/${n.hinh_anh}`;

  const renderIcon = (type) => {
    if (type === "HTFood") return <FaHome className="me-1" />;
    if (type === "Trong nước") return <FaFlag className="me-1" />;
    return <FaGlobeAmericas className="me-1" />;
  };

  return (
    <>
      <Header />

      <Container className="my-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success display-5 mb-3">
            📰 CỔNG THÔNG TIN THỰC PHẨM SẠCH
          </h2>
          <div className="mx-auto bg-success mb-4" style={{ width: '80px', height: '4px', borderRadius: '2px' }}></div>
          <p className="text-muted lead px-lg-5">
            Cập nhật những chuyển động mới nhất của HTFood cùng dòng chảy tin tức thực phẩm an toàn
            trong nước và quốc tế mỗi ngày.
          </p>
        </div>

        {loading ? (
          <div className="text-center my-5 py-5">
            <Spinner animation="grow" variant="success" />
            <p className="mt-3 text-success fw-bold">Đang cập nhật luồng tin...</p>
          </div>
        ) : (
          <Row className="g-4">
            {news.length > 0 ? (
              news.map((item, idx) => (
                <Col lg={4} md={6} key={item.ma_tt || idx}>
                  <Card className="border-0 shadow-sm h-100 news-portal-card">
                    <div className="news-img-container">
                      <img
                        src={img(item)}
                        alt={item.tieu_de}
                        className="news-portal-img"
                        onError={(e) => { e.target.src = "https://placehold.co/600x400?text=HTFood+News"; }}
                      />
                      <Badge className={`news-portal-badge badge-${item.loai_tin}`}>
                        {renderIcon(item.loai_tin)} {item.loai_tin}
                      </Badge>
                    </div>
                    <Card.Body className="p-4 d-flex flex-column">
                      <small className="text-uppercase fw-bold text-secondary mb-2" style={{ letterSpacing: '1px' }}>
                        {new Date(item.ngay_dang).toLocaleDateString("vi-VN")}
                      </small>
                      <h5 className="fw-bold text-dark mb-3 portal-title-limit">
                        {item.tieu_de}
                      </h5>
                      <p className="text-muted small portal-desc-limit flex-grow-1">
                        {item.mo_ta}
                      </p>
                      <Link
                        to={`/tin-tuc/${item.ma_tt}`}
                        className="portal-read-link mt-3"
                      >
                        XEM CHI TIẾT →
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col className="text-center py-5">
                <FaNewspaper size={80} className="text-muted opacity-25 mb-3" />
                <h4 className="text-muted">Đang cập nhật tin tức mới...</h4>
              </Col>
            )}
          </Row>
        )}
      </Container>

      <Footer />

      <style>{`
        .news-portal-card {
          border-radius: 12px;
          transition: transform .3s ease, box-shadow .3s ease;
          overflow: hidden;
        }
        .news-portal-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .news-img-container {
          position: relative;
          height: 240px;
          overflow: hidden;
        }
        .news-portal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }
        .news-portal-card:hover .news-portal-img {
          transform: scale(1.05);
        }
        .news-portal-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 8px 15px;
          font-weight: 500;
          font-size: 0.8rem;
          border-radius: 5px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .badge-HTFood { background-color: #28a745 !important; }
        .badge-Trong\ nước { background-color: #17a2b8 !important; }
        .badge-Thế\ giới { background-color: #343a40 !important; }

        .portal-title-limit {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 3rem;
          line-height: 1.5rem;
        }
        .portal-desc-limit {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 4.5rem;
        }
        .portal-read-link {
          color: #28a745;
          font-weight: 800;
          font-size: 0.85rem;
          text-decoration: none;
          letter-spacing: 0.5px;
        }
        .portal-read-link:hover {
          color: #19692c;
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}

export default TinTuc;
