import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function TinTuc() {
  return (
    <>
      <Header />

      <Container className="my-5">
        <h2 className="text-center mb-4 fw-bold text-success">
          📰 TIN HOT THỰC PHẨM SẠCH
        </h2>

        <p className="text-center text-muted mb-5">
          Cập nhật tin tức mới nhất về thực phẩm sạch, giá nông sản, sức khỏe
          và xu hướng tiêu dùng an toàn.
        </p>

        <Row className="g-4">
          {[
            {
              img: "https://i.ytimg.com/vi/X-NWppX0do0/hq720.jpg",
              title: "Giá tôm hôm nay bao tiền 1kg? Cập nhật mới nhất 2026",
              link: "/tin-tuc/gia-tom",
              desc:
                "Giá tôm thường xuyên biến động theo mùa vụ, kích cỡ và vùng nuôi..."
            },
            {
              img: "https://bizweb.dktcdn.net/100/434/209/files/rau-cu-huu-co-vietgap-1.jpg",
              title: "Top cửa hàng rau củ sạch hữu cơ chất lượng nhất 2026",
              link: "/tin-tuc/rau-cu-sach",
              desc:
                "Rau củ hữu cơ ngày càng được ưa chuộng nhờ đảm bảo an toàn sức khỏe..."
            },
            {
              img: "https://fitfood.vn/img/2048x1365/images/thumbnail-17133496266221.jpeg",
              title: "50 loại thực phẩm siêu tốt cho sức khỏe",
              link: "/tin-tuc/thuc-pham-suc-khoe",
              desc:
                "Danh sách thực phẩm sạch giúp tăng cường sức đề kháng mỗi ngày..."
            },
          ].map((item, idx) => (
            <Col md={4} sm={6} key={idx}>
              <Card className="border-0 shadow-sm h-100 news-card">
                <img
                  src={item.img}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: "260px", objectFit: "cover" }}
                />
                <Card.Body>
                  <h5 className="fw-bold text-success">
                    {item.title}
                  </h5>
                  <p className="text-muted small">{item.desc}</p>
                  <Link
                    to={item.link}
                    className="text-success fw-semibold text-decoration-none"
                  >
                    Đọc thêm →
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Footer />

      <style>{`
        .news-card {
          border-radius: 14px;
          transition: all .3s ease;
        }
        .news-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 30px rgba(0,0,0,.15);
        }
      `}</style>
    </>
  );
}

export default TinTuc;
