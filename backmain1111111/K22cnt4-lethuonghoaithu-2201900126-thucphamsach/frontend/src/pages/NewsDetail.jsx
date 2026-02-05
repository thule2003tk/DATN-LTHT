import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Spinner, Badge, Breadcrumb, Button, Card } from "react-bootstrap";
import { FaCalendarAlt, FaTag, FaChevronLeft } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "../api/axiosClient";

function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    const [recentNews, setRecentNews] = useState([]);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await axiosClient.get(`/tintuc/${id}`);
                setNews(res.data);

                // Lấy thêm tin tức mới nhất
                const recentRes = await axiosClient.get("/tintuc");
                setRecentNews(recentRes.data?.filter(item => item.ma_tt !== parseInt(id)).slice(0, 3) || []);
            } catch (err) {
                console.error("Lỗi lấy chi tiết tin:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="text-center my-5 py-5">
            <Spinner animation="border" variant="success" />
        </div>
    );

    if (!news) return (
        <Container className="my-5 text-center">
            <h3>Không tìm thấy tin tức</h3>
            <Link to="/tin-tuc" className="btn btn-success mt-3">Quay lại danh sách</Link>
        </Container>
    );

    const img = (h) => h?.startsWith("http") ? h : `http://localhost:3001/uploads/${h}`;

    return (
        <>
            <Header />
            <div className="bg-light py-3 border-bottom mb-4">
                <Container>
                    <Breadcrumb className="mb-0">
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/tin-tuc" }}>Tin tức</Breadcrumb.Item>
                        <Breadcrumb.Item active>{news.tieu_de}</Breadcrumb.Item>
                    </Breadcrumb>
                </Container>
            </div>

            <Container className="mb-5">
                <Row>
                    <Col lg={8}>
                        <div className="news-content-wrap bg-white p-4 p-md-5 rounded shadow-sm mb-4">
                            <Link to="/tin-tuc" className="text-success text-decoration-none mb-4 d-inline-block fw-bold">
                                <FaChevronLeft className="me-1" /> QUAY LẠI
                            </Link>

                            <Badge bg="success" className="mb-3 p-2 px-3">{news.loai_tin}</Badge>
                            <h1 className="fw-bold mb-4 text-dark display-6">{news.tieu_de}</h1>

                            <div className="d-flex align-items-center text-muted mb-4 pb-3 border-bottom">
                                <div className="me-4 d-flex align-items-center">
                                    <FaCalendarAlt className="me-2 text-success" />
                                    {new Date(news.ngay_dang).toLocaleDateString("vi-VN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                                <div className="d-flex align-items-center">
                                    <FaTag className="me-2 text-success" />
                                    HTFood Clean News
                                </div>
                            </div>

                            <div className="news-detail-image mb-5">
                                <img
                                    src={img(news.hinh_anh)}
                                    alt={news.tieu_de}
                                    className="w-100 rounded shadow-sm"
                                    style={{ maxHeight: '500px', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = "https://placehold.co/600x400?text=HTFood+News"; }}
                                />
                            </div>

                            <div className="news-main-body lead-text">
                                <p className="fw-bold fst-italic text-secondary mb-4" style={{ fontSize: '1.2rem', borderLeft: '4px solid #28a745', paddingLeft: '1.5rem' }}>
                                    {news.mo_ta}
                                </p>

                                <div className="content-detail" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                                    {news.noi_dung}
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-top">
                                <p className="text-muted small">Nguồn: Ban Biên Tập HTFood</p>
                                <div className="share-news d-flex gap-2">
                                    <Button variant="outline-primary" size="sm">Chia sẻ Facebook</Button>
                                    <Button variant="outline-info" size="sm">Chia sẻ Zalo</Button>
                                </div>
                            </div>
                        </div>
                    </Col>

                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '100px', zIndex: '1' }}>
                            <Card className="border-0 shadow-sm mb-4">
                                <Card.Header className="bg-success text-white fw-bold py-3">
                                    TIN TỨC MỚI NHẤT
                                </Card.Header>
                                <Card.Body className="p-0">
                                    {recentNews.length > 0 ? (
                                        recentNews.map(item => (
                                            <Link key={item.ma_tt} to={`/tin-tuc/${item.ma_tt}`} className="text-decoration-none border-bottom d-block p-3 recent-news-item">
                                                <div className="d-flex gap-3">
                                                    <img src={img(item.hinh_anh)} alt="thumb" className="rounded" style={{ width: '80px', height: '60px', objectFit: 'cover' }} onError={(e) => { e.target.src = "https://placehold.co/600x400?text=HTFood+News"; }} />
                                                    <div className="flex-grow-1">
                                                        <h6 className="text-dark fw-bold mb-1 small-title-limit">{item.tieu_de}</h6>
                                                        <small className="text-muted">{new Date(item.ngay_dang).toLocaleDateString("vi-VN")}</small>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-muted">Đang cập nhật...</div>
                                    )}
                                    <div className="p-3 text-center">
                                        <Link to="/tin-tuc" className="btn btn-sm btn-outline-success w-100 fw-bold">XEM TẤT CẢ</Link>
                                    </div>
                                </Card.Body>
                            </Card>

                            <Card className="border-0 shadow-sm bg-success text-white text-center p-4">
                                <h5 className="fw-bold mb-3">HTFood - Sạch từ Tâm</h5>
                                <p className="small mb-0">Cam kết cung cấp thực phẩm an toàn, hữu cơ cho mọi gia đình Việt.</p>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />

            <style>{`
        .news-content-wrap {
          border: 1px solid #eee;
        }
        .content-detail {
          color: #333;
          font-size: 1.15rem;
        }
        .lead-text p {
          margin-bottom: 1.5rem;
        }
      `}</style>
        </>
    );
}

export default NewsDetail;
