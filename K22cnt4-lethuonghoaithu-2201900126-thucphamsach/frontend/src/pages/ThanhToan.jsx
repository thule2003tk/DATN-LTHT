import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import Footer from "../components/Footer";
import Header from "../components/Header";

function ThanhToan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ma_donhang, tongtien } = location.state || {}; // Nhận từ Checkout

  const [phuongthuc, setPhuongthuc] = useState("Chuyển khoản");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleThanhToan = async () => {
    if (!ma_donhang) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3001/api/donhang/thanhtoan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_donhang,
          phuongthuc,
          sotien: tongtien,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi thanh toán");

      setSuccess(`✅ Xác nhận thành công! Đang chuyển hướng...`);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!ma_donhang) {
    return (
      <Container className="my-5 text-center py-5">
        <Alert variant="danger">⚠️ Không tìm thấy thông tin đơn hàng</Alert>
        <Button variant="success" onClick={() => navigate("/")}>
          Quay lại trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container className="my-5 py-5">
        <Card className="mx-auto shadow-lg border-0 rounded-4" style={{ maxWidth: "600px" }}>
          <Card.Body className="p-4 p-md-5 text-center">
            <h2 className="text-success fw-bold mb-4">
              Thanh Toán Đơn Hàng
            </h2>
            <p className="text-muted mb-4">Mã đơn hàng: <strong className="text-dark">#{ma_donhang}</strong></p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div className="bg-success bg-opacity-10 p-4 rounded-3 mb-4">
              <h5 className="mb-0">
                Số tiền cần thanh toán: <br />
                <strong className="text-danger fs-3">
                  {Number(tongtien).toLocaleString("vi-VN")}₫
                </strong>
              </h5>
            </div>

            <Form>
              <Form.Group className="mb-4 text-start">
                <Form.Label className="fw-bold">Chọn phương thức:</Form.Label>
                <Form.Select
                  value={phuongthuc}
                  onChange={(e) => setPhuongthuc(e.target.value)}
                  className="bg-white border-success"
                >
                  <option value="Chuyển khoản">Chuyển khoản ngân hàng (QR)</option>
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                </Form.Select>
              </Form.Group>

              {phuongthuc === "Chuyển khoản" && (
                <div className="text-center mb-4">
                  <p className="mb-3 fw-bold text-muted small">Vui lòng quét mã QR bên dưới để thanh toán</p>
                  <div className="bg-white p-3 rounded shadow-sm d-inline-block mb-3 border border-light">
                    <img
                      src={`https://img.vietqr.io/image/MB-0333333333333-compact.png?amount=${tongtien}&addInfo=THANH TOAN ${ma_donhang}`}
                      className="img-fluid"
                      style={{ maxWidth: "280px" }}
                      alt="QR Code"
                    />
                  </div>
                  <div className="text-start bg-white p-3 rounded border mx-auto" style={{ maxWidth: "400px" }}>
                    <p className="mb-1 small">Ngân hàng: <strong>MB Bank</strong></p>
                    <p className="mb-1 small">STK: <strong>0333333333333</strong></p>
                    <p className="mb-1 small">Chủ TK: <strong>LE THUONG HOAI THU</strong></p>
                    <p className="mb-0 small text-danger italic">* Nội dung: <strong>THANH TOAN {ma_donhang}</strong></p>
                  </div>
                </div>
              )}

              <Button
                variant="success"
                size="lg"
                className="w-100 py-3 fw-bold rounded-pill shadow-sm"
                onClick={handleThanhToan}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : (phuongthuc === "Chuyển khoản" ? "TÔI ĐÃ CHUYỂN KHOẢN" : "XÁC NHẬN ĐẶT HÀNG")}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}

export default ThanhToan;
