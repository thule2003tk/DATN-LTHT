import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Table, Alert, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

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

  return (
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
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>#DH{String(index + 1).padStart(4, "0")}</td>
                  <td>{new Date(order.date).toLocaleDateString("vi-VN")}</td>
                  <td>{order.items.length} sản phẩm</td>
                  <td className="fw-bold text-success">
                    {order.total.toLocaleString("vi-VN")}₫
                  </td>
                  <td>
                    <span className="badge bg-warning text-dark">Chờ xác nhận</span>
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
  );
}

export default Orders;