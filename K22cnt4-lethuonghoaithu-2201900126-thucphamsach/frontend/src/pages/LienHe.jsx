import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import lienHeApi from "../api/lienhe";
import { useAuth } from "../context/AuthContext";

export default function LienHe() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    ten: "",
    email: "",
    noidung: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Tự động điền thông tin nếu người dùng đã đăng nhập
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        ten: user.hoten || user.ten_dangnhap || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ten || !formData.email || !formData.noidung) {
      setMessage({ type: "danger", text: "Vui lòng điền đầy đủ thông tin!" });
      return;
    }
    setLoading(true);
    try {
      await lienHeApi.createContact(formData);
      setMessage({ type: "success", text: "Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất." });
      setFormData({ ten: "", email: "", noidung: "" });
    } catch (error) {
      console.error("Error sending contact:", error);
      setMessage({ type: "danger", text: "Có lỗi xảy ra, vui lòng thử lại sau." });
    } finally {
      setLoading(false);
    }
  };

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

                {message.text && (
                  <Alert variant={message.type} onClose={() => setMessage({ type: "", text: "" })} dismissible>
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        name="ten"
                        value={formData.ten}
                        onChange={handleChange}
                        placeholder="Nhập họ tên"
                        required
                      />
                    </Col>

                    <Col md={6} className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                      />
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <Form.Label>Nội dung</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="noidung"
                      value={formData.noidung}
                      onChange={handleChange}
                      placeholder="Nội dung liên hệ..."
                      required
                    />
                  </div>

                  <Button variant="success" size="lg" type="submit" disabled={loading}>
                    {loading ? "Đang gửi..." : "Gửi liên hệ"}
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
