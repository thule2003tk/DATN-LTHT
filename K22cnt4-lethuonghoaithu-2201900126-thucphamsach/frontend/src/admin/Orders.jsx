// src/pages/AdminOrders.jsx
import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";
import { getAllOrders } from "../api/donhang.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError(
          err.message.includes("401")
            ? "Bạn không có quyền xem trang này. Vui lòng đăng nhập Admin."
            : "Lỗi khi tải đơn hàng!"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <Container className="my-5 py-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );

  return (
    <Container className="my-5">
      <h2 className="text-success mb-4">Quản lý đơn hàng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {!error && (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Mã Đơn</th>
              <th>Mã Khách</th>
              <th>Ngày Đặt</th>
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              <th>Mã KM</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.ma_donhang}>
                  <td>{order.ma_donhang}</td>
                  <td>{order.ma_kh}</td>
                  <td>{new Date(order.ngay_dat).toLocaleString()}</td>
                  <td>{Number(order.tongtien).toLocaleString()}₫</td>
                  <td>{order.trangthai}</td>
                  <td>{order.ma_km || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  Chưa có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default AdminOrders;
