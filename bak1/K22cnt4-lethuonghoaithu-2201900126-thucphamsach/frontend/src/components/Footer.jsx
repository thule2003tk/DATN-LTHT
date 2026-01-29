import { Link } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";
import {
    FaFacebook, FaInstagram, FaYoutube, FaMapMarkerAlt,
    FaPhone, FaEnvelope
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer mt-5">
            <Container>
                <Row className="g-4">
                    <Col lg={4} md={6} className="footer-column">
                        <h4 className="footer-title">Thực Phẩm Sạch</h4>
                        <p className="footer-text">
                            Cam kết mang đến sản phẩm hữu cơ, sạch 100%, tươi mới mỗi ngày
                            từ nông trại đến bàn ăn của bạn. Sức khỏe của bạn là ưu tiên hàng đầu của chúng tôi.
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><FaFacebook /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaYoutube /></a>
                        </div>
                    </Col>

                    <Col lg={3} md={6} className="footer-column">
                        <h5 className="footer-title">Liên Kết Nhanh</h5>
                        <Nav className="flex-column footer-links">
                            <Nav.Link as={Link} to="/" className="text-light">Trang chủ</Nav.Link>
                            <Nav.Link as={Link} to="/products" className="text-light">Sản phẩm</Nav.Link>
                            <Nav.Link as={Link} to="/about" className="text-light">Giới thiệu</Nav.Link>
                            <Nav.Link as={Link} to="/contact" className="text-light">Liên hệ</Nav.Link>
                        </Nav>
                    </Col>

                    <Col lg={3} md={6} className="footer-column">
                        <h5 className="footer-title">Hỗ Trợ Khách Hàng</h5>
                        <Nav className="flex-column footer-links">
                            <Nav.Link href="#" className="text-light">Chính sách đổi trả</Nav.Link>
                            <Nav.Link href="#" className="text-light">Chính sách giao hàng</Nav.Link>
                            <Nav.Link href="#" className="text-light">Hướng dẫn mua hàng</Nav.Link>
                            <Nav.Link href="#" className="text-light">Câu hỏi thường gặp</Nav.Link>
                        </Nav>
                    </Col>

                    <Col lg={2} md={6} className="footer-column">
                        <h5 className="footer-title">Liên Hệ</h5>
                        <div className="contact-info small">
                            <p><FaMapMarkerAlt /> 123 Đường ABC, Q.1, TP.HCM</p>
                            <p><FaPhone /> 1900 1234</p>
                            <p><FaEnvelope /> support@thucphamsach.vn</p>
                        </div>
                    </Col>
                </Row>

                <hr className="footer-divider" />

                <div className="footer-bottom">
                    © {new Date().getFullYear()} Thực Phẩm Sạch. All rights reserved.
                    <br /> Designed with ❤️ for a healthy life.
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
