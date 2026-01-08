import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Lấy đơn hàng từ localStorage (tạm thời, sau kết nối backend)
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Container className="my-5 py-5">
      <h1 className="text-center mb-5 text-success fw-bold">Lịch Sử Đơn Hàng</h1>

      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          Bạn chưa có đơn hàng nào. <a href="/" className="text-success fw-bold">Mua sắm ngay!</a>
        </Alert>
      ) : (
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
      )}
    </Container>
  );
}

export default Orders;