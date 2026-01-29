import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Table, Alert, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/categories.js";

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  // Fix warning: Không gọi navigate trực tiếp trong render phase
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Nếu chưa đăng nhập → không render gì (đã redirect trong useEffect)
  if (!user) {
    return null;
  }

  const handleContinuePayment = (ma_donhang) => {
    // Chuyển về checkout với ma_donhang để tiếp tục thanh toán đơn cũ
    navigate("/checkout", { state: { ma_donhang } });
  };

  return (
    <>
      <Header categories={categories} />
      <Container className="my-5 py-5">
        <h1 className="text-center mb-5 text-success fw-bold">Lịch Sử Đơn Hàng</h1>

        {orders.length === 0 ? (
          <Alert variant="info" className="text-center">
            Bạn chưa có đơn hàng nào.{" "}
            <Link to="/" className="text-success fw-bold">
              Mua sắm ngay!
            </Link>
          </Alert>
        ) : (
          <>
            <Table striped bordered hover responsive className="table-success shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày đặt</th>
                  <th>Số lượng sản phẩm</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.ma_donhang}</td>
                    <td>{new Date(order.date).toLocaleDateString("vi-VN")}</td>
                    <td>{order.items.length} sản phẩm</td>
                    <td className="fw-bold text-success">
                      {order.total.toLocaleString("vi-VN")}₫
                    </td>
                    <td>
                      <span className={`badge bg-${order.status === "Đã thanh toán" ? "success" : "warning"} text-dark`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === "Chưa thanh toán" && (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleContinuePayment(order.ma_donhang)}
                        >
                          Tiếp tục thanh toán
                        </Button>
                      )}
                      {order.status === "Chờ xử lý" && (
                        <span className="text-muted">Đang chờ admin xác nhận</span>
                      )}
                      {order.status === "Chờ giao hàng" && (
                        <span className="text-success">Đang chuẩn bị giao</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Nút Trở về Trang Chủ - Thêm ở dưới bảng */}
            <div className="text-center mt-5">
              <Button
                variant="outline-primary"
                size="lg"
                as={Link}
                to="/"
                className="px-5 py-3 fw-bold"
              >
                <FaHome className="me-2" /> Trở về Trang Chủ
              </Button>
            </div>
          </>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default Orders;