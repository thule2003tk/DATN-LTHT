import { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner, Button, Modal, Form, Badge } from "react-bootstrap";
import { getAllOrders, updateOrderStatus } from "../api/donhang.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [cancelReason, setCancelReason] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);

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
      await updateOrderStatus(ma_donhang, { trangthai: "Đang giao hàng" });
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

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
    setDetailLoading(true);
    setOrderDetails([]);
    try {
      const { getOrderDetail } = await import("../api/donhang.js");
      const data = await getOrderDetail(order.ma_donhang);
      setOrderDetails(data);
    } catch (err) {
      console.error("Lỗi lấy chi tiết:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert("Vui lòng nhập lý do hủy đơn");
      return;
    }

    try {
      await updateOrderStatus(selectedOrder.ma_donhang, {
        trangthai: "Đã hủy",
        ly_do_huy: cancelReason
      });
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
      <h2 className="text-success mb-4">📦 Quản lý đơn hàng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table hover responsive className="shadow-sm rounded overflow-hidden">
        <thead className="table-success text-dark">
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Người nhận</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.ma_donhang} className="align-middle">
              <td className="fw-bold text-success">{o.ma_donhang}</td>
              <td className="small">ID: {o.ma_kh || "—"}</td>
              <td className="small">
                <div className="fw-bold">{o.hoten_nhan}</div>
                <div>{o.sdt_nhan}</div>
                {o.email_nhan && <div className="text-primary italic">{o.email_nhan}</div>}
              </td>
              <td className="small">{new Date(o.ngay_dat).toLocaleString("vi-VN")}</td>
              <td className="fw-bold">{Number(o.tongtien).toLocaleString()}₫</td>
              <td>
                <Badge
                  bg={o.trangthai === "Chờ xử lý"
                    ? "warning"
                    : o.trangthai === "Đã hủy"
                      ? "danger"
                      : "success"}
                  className="text-dark"
                >
                  {o.trangthai}
                </Badge>
                {o.trangthai === "Đã hủy" && o.ly_do_huy && (
                  <div className="text-danger small italic mt-1" style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={o.ly_do_huy}>
                    Lý do: {o.ly_do_huy}
                  </div>
                )}
              </td>
              <td>
                <div className="d-flex gap-2 justify-content-center">
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleViewDetails(o)}
                  >
                    Xem
                  </Button>
                  {o.trangthai === "Chờ xử lý" && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleConfirm(o.ma_donhang)}
                    >
                      Giao hàng
                    </Button>
                  )}
                  {o.trangthai !== "Đã hủy" && (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleOpenCancelModal(o)}
                    >
                      Hủy
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Chi Tiết Đơn Hàng */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Chi tiết đơn hàng: {selectedOrder?.ma_donhang}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {detailLoading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
          ) : (
            <>
              <div className="row mb-4">
                <div className="col-md-6">
                  <h6 className="fw-bold text-success border-bottom pb-2">📍 Thông tin giao hàng</h6>
                  <p className="mb-1"><strong>Người nhận:</strong> {selectedOrder?.hoten_nhan}</p>
                  <p className="mb-1"><strong>SĐT:</strong> {selectedOrder?.sdt_nhan}</p>
                  <p className="mb-1"><strong>Email:</strong> {selectedOrder?.email_nhan || "—"}</p>
                  <p className="mb-1"><strong>Địa chỉ:</strong> {selectedOrder?.diachi_nhan}</p>
                  <p className="mb-1"><strong>Ghi chú:</strong> {selectedOrder?.ghichu || "—"}</p>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-bold text-success border-bottom pb-2">💳 Thanh toán</h6>
                  <p className="mb-1"><strong>Phương thức:</strong> {selectedOrder?.phuongthuc}</p>
                  <p className="mb-1"><strong>Trạng thái:</strong> {selectedOrder?.trangthai}</p>
                  {selectedOrder?.ma_bi_mat && (
                    <p className="mb-1 text-primary"><strong>Mã định danh:</strong> <span className="fw-bold">{selectedOrder?.ma_bi_mat}</span></p>
                  )}
                  {selectedOrder?.ly_do_huy && (
                    <p className="mb-1 text-danger"><strong>Lý do hủy:</strong> {selectedOrder?.ly_do_huy}</p>
                  )}
                </div>
              </div>

              <h6 className="fw-bold text-success border-bottom pb-2 mb-3">🛒 Danh sách sản phẩm</h6>
              <Table responsive align="middle">
                <thead className="table-light">
                  <tr>
                    <th>Ảnh</th>
                    <th>Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-end">Đơn giá</th>
                    <th className="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <img
                          src={item.hinhanh?.startsWith('http') ? item.hinhanh : `http://localhost:3001/uploads/${item.hinhanh}`}
                          alt={item.ten_sp}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td className="fw-bold small">{item.ten_sp}</td>
                      <td className="text-center">{item.soluong}</td>
                      <td className="text-end">{Number(item.dongia).toLocaleString()}₫</td>
                      <td className="text-end fw-bold">{(item.soluong * item.dongia).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end fw-bold fs-5">Tổng cộng:</td>
                    <td className="text-end fw-bold text-success fs-5">{Number(selectedOrder?.tongtien).toLocaleString()}₫</td>
                  </tr>
                </tfoot>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Hủy Đơn */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
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
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleCancelOrder}>Xác nhận hủy đơn</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminOrders;
