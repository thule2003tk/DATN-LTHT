import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/categories.js";

function ThanhToan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ma_donhang, tongtien } = location.state || {}; // Nhận từ Checkout

  const [phuongthuc, setPhuongthuc] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleThanhToan = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/donhang/thanhtoan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ma_donhang,
          phuongthuc,
          sotien: tongtien,
        }),
      });

      if (!res.ok) throw new Error("Lỗi thanh toán");

      const data = await res.json();
      setSuccess(`Thanh toán thành công! Mã thanh toán: ${data.ma_tt}`);
      setTimeout(() => navigate("/orders"), 3000); // Quay về lịch sử đơn
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!ma_donhang) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">Không tìm thấy đơn hàng</Alert>
        <Button variant="success" onClick={() => navigate("/")}>Về trang chủ</Button>
      </Container>
    );
  }

  return (
    <>
      <Header categories={categories} />
      <Container className="my-5 py-5">
        <h2 className="text-success text-center mb-5">Thanh Toán Đơn Hàng #{ma_donhang}</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="text-center mb-4">
          <h4>Tổng tiền: <strong className="text-danger">{tongtien.toLocaleString("vi-VN")}₫</strong></h4>
        </div>

        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Phương thức thanh toán</Form.Label>
            <Form.Select value={phuongthuc} onChange={(e) => setPhuongthuc(e.target.value)}>
              <option value="COD">Thanh toán khi nhận hàng (COD)</option>
              <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
              <option value="Ví điện tử">Ví điện tử (Momo/ZaloPay)</option>
            </Form.Select>
          </Form.Group>

          <Button
            variant="success"
            size="lg"
            className="w-100 py-3 fw-bold"
            onClick={handleThanhToan}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác Nhận Thanh Toán"}
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
}

export default ThanhToan;