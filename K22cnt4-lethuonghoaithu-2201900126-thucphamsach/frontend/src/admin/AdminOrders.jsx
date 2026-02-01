import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner, Button, Modal, Form, Badge } from "react-bootstrap";
import { getAllOrders, updateOrderStatus } from "../api/donhang.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("Fetching orders from API...");
      const data = await getAllOrders();
      console.log("Orders received:", data);
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Data is not an array:", data);
        setError("Dữ liệu trả về không đúng định dạng array.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(`Lỗi tải đơn hàng: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (ma_donhang) => {
    try {
      await updateOrderStatus(ma_donhang, "Đang giao hàng");
      setOrders((prev) =>
        prev.map((o) =>
          o.ma_donhang === ma_donhang
            ? { ...o, trangthai: "Đang giao hàng" }
            : o
        )
      );
    } catch (err) {
      alert("Lỗi xác nhận đơn hàng");
    }
  };

  const handleOpenCancelModal = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn");
      return;
    }

    try {
      await updateOrderStatus(selectedOrder.ma_donhang, "Đã hủy", cancelReason);
      setOrders((prev) =>
        prev.map((o) =>
          o.ma_donhang === selectedOrder.ma_donhang
            ? { ...o, trangthai: "Đã hủy", ly_do_huy: cancelReason }
            : o
        )
      );
      setShowCancelModal(false);
      setCancelReason("");
    } catch (err) {
      alert("Lỗi hủy đơn hàng");
    }
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
            <th>Phương thức</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Lý do hủy</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.ma_donhang}>
              <td>{o.ma_donhang}</td>
              <td>{o.ma_kh || "—"}</td>
              <td>{new Date(o.ngay_dat).toLocaleString("vi-VN")}</td>
              <td>
                <Badge bg={o.phuongthuc === "Chuyển khoản" ? "info" : "secondary"}>
                  {o.phuongthuc || "COD"}
                </Badge>
              </td>
              <td>{Number(o.tongtien).toLocaleString()}₫</td>
              <td>
                <span
                  className={`badge ${o.trangthai === "Chờ xử lý"
                    ? "bg-warning text-dark"
                    : o.trangthai === "Chờ thanh toán"
                      ? "bg-primary"
                      : o.trangthai === "Đã hủy"
                        ? "bg-danger"
                        : "bg-success"
                    }`}
                >
                  {o.trangthai}
                </span>
              </td>
              <td style={{ maxWidth: "200px", fontSize: "0.9rem" }}>
                {o.ly_do_huy || <span className="text-muted italic">—</span>}
              </td>
              <td>
                <div className="d-flex gap-2">
                  {(o.trangthai === "Chờ xử lý" || o.trangthai === "Chờ thanh toán") && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleConfirm(o.ma_donhang)}
                    >
                      {o.trangthai === "Chờ thanh toán" ? "Đã nhận tiền" : "Xác nhận đơn"}
                    </Button>
                  )}
                  {o.trangthai !== "Đã hủy" ? (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleOpenCancelModal(o)}
                    >
                      Hủy đơn
                    </Button>
                  ) : (
                    <span className="text-muted">Đã xử lý</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Hủy Đơn */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hủy đơn hàng: {selectedOrder?.ma_donhang}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Lý do hủy đơn</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Nhập lý do hủy (vd: Hết hàng, Khách đổi ý...)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={handleCancelOrder}>
            Xác nhận hủy đơn
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminOrders;
