import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LienHe() {
  return (
    <>
      <Header />

      {/* ===== BANNER ===== */}
      <div className="contact-banner">
        <h1>Liên Hệ Với HTFood</h1>
        <p>Chúng tôi luôn sẵn sàng hỗ trợ & tư vấn thực phẩm sạch</p>
      </div>

      {/* ===== CONTENT ===== */}
      <Container className="my-5">
        <Row className="g-4">
          {/* ===== THÔNG TIN LIÊN HỆ ===== */}
          <Col lg={4}>
            <Card className="contact-card shadow-sm border-0">
              <Card.Body>
                <h5 className="fw-bold text-success mb-4">
                  🌱 THỰC PHẨM SẠCH HTFOOD
                </h5>

                <p>
                  <FaMapMarkerAlt className="icon" />
                  Đống Đa - Hà Nội
                </p>
                <p>
                  <FaPhoneAlt className="icon" />
                  091676xxxx
                </p>
                <p>
                  <FaEnvelope className="icon" />
                  support@htfood.vn
                </p>
                <p>
                  <FaClock className="icon" />
                  7:00 – 21:00 (T2 – CN)
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* ===== FORM LIÊN HỆ ===== */}
          <Col lg={8}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="fw-bold text-success mb-4">
                  ✉️ GỬI LIÊN HỆ CHO CHÚNG TÔI
                </h5>

                <Form>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control placeholder="Nhập họ tên" />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="example@email.com" />
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control placeholder="0909xxxxxx" />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Tiêu đề</Form.Label>
                      <Form.Control placeholder="Tư vấn sản phẩm / Khiếu nại..." />
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Nội dung liên hệ..."
                    />
                  </div>

                  <Button variant="success" size="lg">
                    Gửi liên hệ
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ===== GOOGLE MAP ===== */}
        <Row className="mt-5">
          <Col>
            <Card className="border-0 shadow-sm">
              <iframe
                title="HTFood Map"
                src="https://www.google.com/maps?q=Ho%20Chi%20Minh&output=embed"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: "12px" }}
                loading="lazy"
              ></iframe>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />

      {/* ===== CSS ===== */}
      <style>{`
        .contact-banner {
          background: linear-gradient(135deg, #1f6b3a, #2f8f4e);
          color: white;
          padding: 60px 20px;
          text-align: center;
        }

        .contact-banner h1 {
          font-weight: 800;
          margin-bottom: 10px;
        }

        .contact-banner p {
          opacity: 0.9;
        }

        .contact-card p {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          color: #444;
        }

        .contact-card .icon {
          color: #2f8f4e;
        }

        form label {
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
