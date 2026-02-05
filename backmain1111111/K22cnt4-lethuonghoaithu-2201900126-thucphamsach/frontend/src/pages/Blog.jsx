import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";
import { FaBookOpen, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllBlog } from "../api/blog";

function Blog() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await getAllBlog();
                setBlogs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi lấy blog:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="blog-magazine bg-light min-vh-100">
            <Header />

            <section className="mag-hero py-5">
                <Container>
                    <div className="text-center py-5 border-bottom border-top border-dark border-3">
                        <h6 className="text-uppercase fw-bold text-success mb-2" style={{ letterSpacing: '3px' }}>The HTFood Journal</h6>
                        <h1 className="display-2 fw-black mag-title mb-3">CẨM NANG SỐNG KHỎE</h1>
                        <p className="mag-subtitle mx-auto text-muted">Bí quyết chọn thực phẩm sạch, dinh dưỡng và lối sống lành mạnh cho gia đình hiện đại.</p>
                    </div>
                </Container>
            </section>

            <Container className="py-5">
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" size="lg" />
                        <p className="mt-3 article-font text-muted">Đang biên tập dữ liệu...</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {blogs.length > 0 ? (
                            blogs.map((item, idx) => (
                                <Col lg={4} md={6} key={item.id || idx}>
                                    <Card
                                        className="border-0 bg-white mag-card h-100 shadow-sm overflow-hidden"
                                        onClick={() => navigate(`/blog/${item.id}`)}
                                    >
                                        <div className="mag-img-container rounded-0 mb-0">
                                            <img
                                                src={item.img?.startsWith("http") ? item.img : `http://localhost:3001/uploads/${item.img}`}
                                                alt={item.title}
                                                className="mag-img w-100 h-100"
                                                onError={(e) => { e.target.src = "https://placehold.co/800x600?text=HTFood+Knowledge"; }}
                                            />
                                            <div className="mag-category-badge">{item.category || "Handbook"}</div>
                                        </div>
                                        <Card.Body className="p-4 d-flex flex-column bg-white">
                                            <h4 className="fw-bold text-dark mb-3 mag-article-title">
                                                {item.title}
                                            </h4>
                                            <p className="mag-excerpt text-secondary mb-4 flex-grow-1 x-small-desc">
                                                {item.desc1}
                                            </p>
                                            <div className="text-uppercase fw-bold x-small text-success border-top pt-3 d-flex justify-content-between align-items-center">
                                                <span>Đọc tiếp →</span>
                                                <span className="text-muted">{new Date(item.ngay_tao || Date.now()).toLocaleDateString("vi-VN")}</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center py-5">
                                <FaBookOpen size={80} className="text-muted opacity-25 mb-3" />
                                <h4 className="text-muted">Đang cập nhật thêm bài viết mới...</h4>
                            </Col>
                        )}
                    </Row>
                )}
            </Container>

            <Footer />

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;1,400&display=swap');
        
        .blog-magazine { background-color: #f8f9fa !important; }
        .mag-title { font-family: 'Playfair Display', serif; letter-spacing: -1px; }
        .mag-subtitle { font-family: 'Lora', serif; font-style: italic; max-width: 600px; font-size: 1.1rem; }
        
        .mag-card { cursor: pointer; transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); border-radius: 8px !important; }
        .mag-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important; }
        
        .mag-article-title { font-family: 'Playfair Display', serif; line-height: 1.3; font-size: 1.25rem; }
        .mag-excerpt { font-family: 'Lora', serif; line-height: 1.6; font-size: 0.95rem; }
        
        .mag-img-container { position: relative; overflow: hidden; height: 240px; }
        .mag-img { object-fit: cover; transition: transform 0.8s ease; }
        .mag-card:hover .mag-img { transform: scale(1.1); }
        
        .mag-category-badge {
          position: absolute; top: 15px; left: 15px;
          background: #28a745; color: white;
          padding: 4px 12px; font-size: 0.65rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;
        }
        
        .mag-card:hover .mag-article-title { color: #28a745 !important; }
        
        .x-small { font-size: 0.7rem; letter-spacing: 0.5px; }
        .x-small-desc {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fw-black { font-weight: 900; }
        
        @media (max-width: 991px) {
          .mag-img-container { height: 200px; }
        }
      `}</style>
        </div>
    );
}

export default Blog;
