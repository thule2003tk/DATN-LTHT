import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Breadcrumb } from "react-bootstrap";
import { FaClock, FaUser, FaShareAlt, FaThumbsUp, FaChevronRight } from "react-icons/fa";
import { getBlogDetail, getAllBlog } from "../api/blog.js";
import Header from "../components/Header";
import Footer from "../components/Footer";

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [detail, all] = await Promise.all([
          getBlogDetail(id),
          getAllBlog()
        ]);
        setBlog(detail);
        // Filter related blogs (excluding current one)
        setRelated(Array.isArray(all) ? all.filter(b => b.id != id).slice(0, 5) : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <>
      <Header />
      <Container className="py-5 text-center text-success">
        <h4>Đang tải bài viết...</h4>
      </Container>
      <Footer />
    </>
  );

  if (!blog) return (
    <>
      <Header />
      <Container className="py-5 text-center text-danger">
        <h4>Không tìm thấy bài viết!</h4>
      </Container>
      <Footer />
    </>
  );

  return (
    <div className="blog-detail-page bg-light min-vh-100">
      <Header />

      <div className="bg-white border-bottom py-3 mb-4">
        <Container>
          <Breadcrumb className="mb-0 x-small">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active className="text-success">Tin tức & Sức khỏe</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      <Container className="pb-5">
        <Row className="g-5">
          {/* MAIN CONTENT */}
          <Col lg={8}>
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm">
              <div className="mb-4">
                <Badge bg="success" className="mb-3 px-3 py-2 rounded-pill opacity-75">
                  {blog.category?.toUpperCase()}
                </Badge>
                <h1 className="display-5 fw-bold text-dark mb-4 article-title">
                  {blog.title}
                </h1>

                <div className="d-flex align-items-center gap-4 text-muted small border-bottom pb-4 mb-4">
                  <span className="d-flex align-items-center gap-2">
                    <FaUser className="text-success" /> Ban biên tập TPS
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <FaClock className="text-success" /> 5 phút đọc
                  </span>
                  <span className="ms-auto d-flex gap-3">
                    <FaThumbsUp className="cursor-pointer hover-text-success" />
                    <FaShareAlt className="cursor-pointer hover-text-success" />
                  </span>
                </div>
              </div>

              {blog.desc1 && (
                <p className="lead fw-bold text-secondary mb-4 border-start border-4 border-success ps-4 py-2 bg-light">
                  {blog.desc1}
                </p>
              )}

              <img
                src={blog.img?.startsWith("http") ? blog.img : `http://localhost:3001/uploads/${blog.img || "placeholder.jpg"}`}
                alt={blog.title}
                className="img-fluid rounded-4 shadow-sm mb-5 w-100 main-article-img"
              />

              <div
                className="article-body fs-5 text-dark"
                dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, '<br/>') }}
              />

              <div className="mt-5 pt-5 border-top d-flex justify-content-between align-items-center">
                <div className="tags d-flex gap-2">
                  <Badge bg="light" text="dark" className="border">#SốngKhỏe</Badge>
                  <Badge bg="light" text="dark" className="border">#RauSạch</Badge>
                </div>
                <div className="reactions text-muted small">
                  {Math.floor(Math.random() * 100) + 50} lượt xem • {Math.floor(Math.random() * 20)} bình luận
                </div>
              </div>
            </div>
          </Col>

          {/* SIDEBAR */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <span className="bg-success rounded-pill p-1" style={{ width: '8px', height: '24px' }}></span>
                BÀI VIẾT NỔI BẬT
              </h5>

              <div className="d-flex flex-column gap-3">
                {related.map((b) => (
                  <Card
                    key={b.id}
                    className="border-0 shadow-sm rounded-3 overflow-hidden side-blog-card"
                    onClick={() => navigate(`/blog/${b.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Row className="g-0">
                      <Col xs={4}>
                        <img
                          src={b.img?.startsWith("http") ? b.img : `http://localhost:3001/uploads/${b.img}`}
                          alt={b.title}
                          className="h-100 w-100 object-fit-cover"
                          style={{ minHeight: '80px' }}
                        />
                      </Col>
                      <Col xs={8}>
                        <Card.Body className="p-2">
                          <h6 className="small fw-bold mb-1 side-card-title">{b.title}</h6>
                          <div className="x-small text-muted d-flex align-items-center gap-2">
                            <FaClock /> 2 ngày trước
                          </div>
                        </Card.Body>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>

              {/* NEWSLETTER BOX */}
              <div className="bg-success text-white p-4 rounded-4 mt-5 shadow">
                <h5 className="fw-bold mb-3">Đăng ký nhận tin</h5>
                <p className="small opacity-75 mb-4">Cập nhật những kiến thức sức khỏe và ưu đãi mới nhất từ Thực Phẩm Sạch.</p>
                <div className="d-flex gap-2">
                  <input type="email" placeholder="Email của bạn..." className="form-control border-0 rounded-pill" />
                  <button className="btn btn-warning rounded-pill px-3 fw-bold">Gửi</button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Footer />

      <style>{`
        .article-title {
          font-family: 'Merriweather', serif; /* Optional: if fonts exist */
          line-height: 1.2;
        }
        .article-body {
          line-height: 1.8;
          color: #333 !important;
        }
        .side-card-title {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .side-blog-card:hover { transform: translateX(5px); background: #f8f9fa; }
        .main-article-img { max-height: 500px; object-fit: cover; }
        .x-small { font-size: 0.75rem; }
        .hover-text-success:hover { color: #28a745 !important; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}

export default BlogDetail;
