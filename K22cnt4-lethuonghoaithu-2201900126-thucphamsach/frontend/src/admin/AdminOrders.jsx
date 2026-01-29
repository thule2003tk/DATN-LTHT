import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner, Button } from "react-bootstrap";
import { getAllOrders, updateOrderStatus } from "../api/donhang.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (err) {
        setError("Lỗi tải đơn hàng (500)");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleConfirm = async (ma_donhang) => {
    await updateOrderStatus(ma_donhang, "Đang giao hàng");
    setOrders((prev) =>
      prev.map((o) =>
        o.ma_donhang === ma_donhang
          ? { ...o, trangthai: "Đang giao hàng" }
          : o
      )
    );
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="success" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-success mb-4">Quản lý đơn hàng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Mã đơn</th>
            <th>Mã KH</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.ma_donhang}>
              <td>{o.ma_donhang}</td>
              <td>{o.ma_kh || "—"}</td>
              <td>{new Date(o.ngay_dat).toLocaleString("vi-VN")}</td>
              <td>{Number(o.tongtien).toLocaleString()}₫</td>
              <td>
                <span
                  className={`badge ${
                    o.trangthai === "Chờ xử lý"
                      ? "bg-warning"
                      : "bg-info"
                  }`}
                >
                  {o.trangthai}
                </span>
              </td>
              <td>
                {o.trangthai === "Chờ xử lý" ? (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleConfirm(o.ma_donhang)}
                  >
                    Xác nhận đơn
                  </Button>
                ) : (
                  <span className="text-muted">Đã xác nhận</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminOrders;
