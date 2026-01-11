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
        setError("");
        const data = await getAllOrders();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
        setOrders(data);
      } catch (err) {
        console.error("Lỗi lấy đơn hàng admin:", err);
        let errMsg = "Lỗi khi tải đơn hàng!";
        if (err.message.includes("401") || err.message.includes("Unauthorized")) {
          errMsg = "Bạn không có quyền xem trang này. Vui lòng đăng nhập với tài khoản Admin.";
        } else if (err.message.includes("500")) {
          errMsg = "Lỗi server backend. Vui lòng kiểm tra console backend.";
        }
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Container className="my-5 py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Đang tải đơn hàng...</p>
      </Container>
    );
  }

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
                  <td>{new Date(order.ngay_dat).toLocaleString("vi-VN")}</td>
                  <td>{Number(order.tongtien || order.tong_tien).toLocaleString("vi-VN")}₫</td>
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