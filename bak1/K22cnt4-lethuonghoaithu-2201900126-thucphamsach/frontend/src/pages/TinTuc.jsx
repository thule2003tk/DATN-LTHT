import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { categories } from "../data/categories.js";

function TinTuc() {


  return (
    <>
      <Header categories={categories} />

      {/* Thanh navigation xanh lá */}
      <nav className="bg-success py-3">
        <Container>
          <div className="d-flex justify-content-center gap-5 text-uppercase fw-semibold">
            <Link to="/" className="text-white text-decoration-none py-2">
              Trang Chủ
            </Link>
            <Link to="/products" className="text-white text-decoration-none py-2">
              Sản Phẩm
            </Link>
            <Link to="/tin-tuc" className="text-white text-decoration-none py-2">
              Tin Tức
            </Link>
            <Link to="/lien-he" className="text-white text-decoration-none py-2">
              Liên Hệ
            </Link>
          </div>
        </Container>
      </nav>

      {/* Phần chính Tin Hot - kiểu giống nongsandungha.com */}
      <Container className="my-5">
        <h2 className="text-center mb-5 fw-bold text-success">TIN HOT</h2>
        <p className="text-center text-muted mb-5">
          Blog Tin Hot Thực Phẩm Sạch – Kênh Tổng Hợp Những Tin Tức Mới Nhất Trong Lĩnh Vực Sức Khỏe, Thực Phẩm Sạch & Hữu Cơ Cho Nhà Hàng, Khách Sạn, Gia Đình. Cập Nhật Ngay!
        </p>

        <Row className="g-4">
          {/* Tin 1: Giá tôm hôm nay */}
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <img
                src="https://i.ytimg.com/vi/X-NWppX0do0/hq720.jpg"
                alt="Giá tôm hôm nay bao tiền 1kg? Cập nhật mới nhất 2026"
                className="card-img-top"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <h5 className="fw-bold text-success">Giá tôm hôm nay bao tiền 1kg? Cập nhật mới nhất 2026</h5>
                <p className="text-muted small">
                  Giá tôm hôm nay bao tiền 1kg? Đây là câu hỏi được rất nhiều người tiêu dùng, chủ quán ăn và nhà hàng quan tâm khi giá tôm thường xuyên biến động theo loại tôm, kích cỡ vùng nuôi trồng và thời điểm thu hoạch...
                </p>
                <Link to="/tin-tuc/gia-tom" className="text-success text-decoration-none">
                  Đọc thêm →
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tin 2: Rau củ sạch hữu cơ */}
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <img
                src="https://bizweb.dktcdn.net/100/434/209/files/rau-cu-huu-co-vietgap-1.jpg"
                alt="Top cửa hàng rau củ sạch hữu cơ chất lượng nhất 2026"
                className="card-img-top"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <h5 className="fw-bold text-success">Top cửa hàng rau củ sạch hữu cơ chất lượng nhất 2026</h5>
                <p className="text-muted small">
                  Rau củ sạch hữu cơ đang ngày càng được ưa chuộng nhờ đảm bảo an toàn sức khỏe. Cập nhật danh sách các cửa hàng uy tín cung cấp rau VietGAP và hữu cơ tốt nhất hiện nay...
                </p>
                <Link to="/tin-tuc/rau-cu-sach" className="text-success text-decoration-none">
                  Đọc thêm →
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tin 3: Thực phẩm sạch an toàn sức khỏe */}
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <img
                src="https://fitfood.vn/img/2048x1365/images/thumbnail-17133496266221.jpeg"
                alt="50 loại thực phẩm siêu tốt cho sức khỏe"
                className="card-img-top"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <h5 className="fw-bold text-success">50 loại thực phẩm siêu tốt cho sức khỏe</h5>
                <p className="text-muted small">
                  Danh sách các thực phẩm sạch, hữu cơ giúp tăng cường sức khỏe, phòng ngừa bệnh tật. Hãy bổ sung ngay vào bữa ăn hàng ngày để sống khỏe mạnh hơn...
                </p>
                <Link to="/tin-tuc/thuc-pham-suc-khoe" className="text-success text-decoration-none">
                  Đọc thêm →
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tin 4: Giá gạo nếp */}
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <img
                src="https://vstatic.vietnam.vn/vietnam/resource/IMAGE/2025/12/10/1765334934750_gao_tin_fake-080746_180.jpeg"
                alt="Giá gạo nếp hôm nay bao tiền 1kg? Cập nhật mới nhất 2026"
                className="card-img-top"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <h5 className="fw-bold text-success">Giá gạo nếp hôm nay bao tiền 1kg? Cập nhật mới nhất 2026</h5>
                <p className="text-muted small">
                  Giá gạo nếp đang biến động như thế nào? Cập nhật giá mới nhất từ các vùng trồng lúa nổi tiếng để quý khách nắm bắt kịp thời...
                </p>
                <Link to="/tin-tuc/gia-gao-nep" className="text-success text-decoration-none">
                  Đọc thêm →
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Tin 5: Lá vúng lá mè */}
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm h-100">
              <img
                src="https://nongsandalat.vn/wp-content/uploads/2023/08/la-me-han-quoc-2.jpg"
                alt="Phạm Như Oanh from 008 purchased Lá Vúng - Lá Mè - Lá Nhip"
                className="card-img-top"
                style={{ height: "300px", objectFit: "cover" }}
              />
              <Card.Body>
                <h5 className="fw-bold text-success">Khách hàng yêu thích Lá Vúng - Lá Mề - Lá Nhip hữu cơ</h5>
                <p className="text-muted small">
                  Sản phẩm lá gia vị sạch đang được nhiều khách hàng tin dùng nhờ nguồn gốc hữu cơ rõ ràng và hương vị tự nhiên...
                </p>
                <Link to="/tin-tuc/la-vung" className="text-success text-decoration-none">
                  Đọc thêm →
                </Link>
              </Card.Body>
            </Card>
          </Col>

          {/* Có thể thêm nhiều tin hơn nếu muốn */}
        </Row>
      </Container>

      <Footer />
    </>
  );
}

export default TinTuc;