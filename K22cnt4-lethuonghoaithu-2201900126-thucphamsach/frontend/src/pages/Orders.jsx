import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Table, Alert, Badge, Card, Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // States cho Modal Chi tiết
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [details, setDetails] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const userId = user.ma_kh || user.ma_nguoidung || user.id;
        const res = await axios.get(`http://localhost:3001/api/donhang/user/${userId}`);
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy lịch sử đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Hàm mở modal và lấy chi tiết
  const handleViewDetail = async (order) => {
    console.log("🖱️ Nhấn xem chi tiết đơn:", order.ma_donhang);
    setSelectedOrder(order);
    setShowModal(true);
    setDetailLoading(true);
    try {
      const url = `http://localhost:3001/api/donhang/detail/${order.ma_donhang}`;
      console.log("📡 Gọi API:", url);
      const res = await axios.get(url);
      console.log("💾 Kết quả trả về:", res.data);
      setDetails(res.data);
    } catch (err) {
      console.error("❌ Lỗi chi tiết đơn:", err.response?.status, err.message);
      if (err.response?.status === 404) {
        console.error("⚠️ Route detail không được tìm thấy trên Server!");
      }
    } finally {
      setDetailLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container className="my-5 py-5">
        <h2 className="text-center text-success fw-bold mb-5">
          Lịch Sử Đơn Hàng Của Bạn
        </h2>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" />
            <p className="mt-2">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length === 0 ? (
          <Card className="border-0 shadow-sm rounded-4 text-center py-5">
            <Card.Body>
              <div className="fs-1 mb-3">🛍️</div>
              <h4>Bạn chưa có đơn hàng nào</h4>
              <p className="text-muted">Hãy tiếp tục mua sắm để ủng hộ cửa hàng nhé!</p>
            </Card.Body>
          </Card>
        ) : (
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Table bordered hover responsive className="mb-0 align-middle">
              <thead className="table-success text-center">
                <tr>
                  <th>Mã đơn</th>
                  <th>Ngày đặt</th>
                  <th>Thanh toán</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {orders.map((o) => (
                  <tr key={o.ma_donhang}>
                    <td className="fw-bold text-primary">#{o.ma_donhang}</td>
                    <td>{new Date(o.ngay_dat).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}</td>
                    <td>
                      <Badge bg="outline-secondary" className="text-dark border">
                        {o.phuongthuc}
                      </Badge>
                    </td>
                    <td className="fw-bold text-danger">
                      {Number(o.tongtien).toLocaleString()}₫
                    </td>
                    <td>
                      <Badge
                        pill
                        bg={
                          o.trangthai === "Đã giao" || o.trangthai === "Đã giao hàng"
                            ? "success"
                            : o.trangthai === "Đã hủy"
                              ? "danger"
                              : o.trangthai === "Chờ thanh toán"
                                ? "info"
                                : "warning"
                        }
                        className="px-3 py-2"
                      >
                        {o.trangthai}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleViewDetail(o)}
                      >
                        Xem
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Container>

      {/* MODAL CHI TIẾT ĐƠN HÀNG - STYLE GIỐNG GIỎ HÀNG */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="order-detail-modal">
        <Modal.Header closeButton className="border-0 bg-success text-white">
          <Modal.Title className="fw-bold">
            🛒 Chi tiết đơn hàng #{selectedOrder?.ma_donhang}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0 bg-light">
          {detailLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Đang tải chi tiết...</p>
            </div>
          ) : (
            <div className="p-4">
              {/* Thông tin vận chuyển tóm tắt */}
              <Card className="border-0 shadow-sm mb-4 rounded-3">
                <Card.Body className="bg-white">
                  <div className="row small">
                    <div className="col-md-6 border-end">
                      <p className="mb-1 text-muted">Người nhận:</p>
                      <h6 className="fw-bold">{selectedOrder?.hoten_nhan} - {selectedOrder?.sdt_nhan}</h6>
                      <p className="mb-0 text-muted">{selectedOrder?.diachi_nhan}</p>
                    </div>
                    <div className="col-md-6 ps-md-4">
                      <p className="mb-1 text-muted">Phương thức & Trạng thái:</p>
                      <h6 className="fw-bold text-success">{selectedOrder?.phuongthuc}</h6>
                      <Badge bg="info" className="text-uppercase">{selectedOrder?.trangthai}</Badge>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                <Table responsive className="align-middle mb-0 cart-style-table">
                  <thead className="bg-success bg-opacity-10">
                    <tr>
                      <th className="ps-4">Sản phẩm</th>
                      <th className="text-center">Số lượng</th>
                      <th className="text-end">Đơn giá</th>
                      <th className="text-end pe-4">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((item, idx) => {
                      const img = item.hinhanh?.startsWith("http")
                        ? item.hinhanh
                        : `http://localhost:3001/uploads/${item.hinhanh}`;

                      return (
                        <tr key={idx}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center gap-3 py-2">
                              <img
                                src={img}
                                alt={item.ten_sp}
                                className="order-item-img"
                                onError={(e) => (e.target.src = "/no-image.png")}
                              />
                              <div>
                                <h6 className="mb-0 fw-bold">{item.ten_sp}</h6>
                                <small className="text-muted">Mã SP: {item.ma_sp}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-bold text-muted">x{item.soluong}</td>
                          <td className="text-end text-success fw-bold">
                            {Number(item.dongia).toLocaleString()}₫
                          </td>
                          <td className="text-end fw-bold pe-4 text-danger">
                            {(item.soluong * item.dongia).toLocaleString()}₫
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card>

              {/* TỔNG KẾT HÓA ĐƠN */}
              <div className="row justify-content-end">
                <div className="col-md-5">
                  <div className="bg-white p-3 rounded shadow-sm border">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Tạm tính:</span>
                      <span className="fw-bold">{Number(selectedOrder?.tongtien).toLocaleString()}₫</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Phí ship:</span>
                      <span className="text-success fw-bold">Miễn phí</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <h5 className="fw-bold text-success mb-0">TỔNG CỘNG:</h5>
                      <h5 className="fw-bold text-danger mb-0">
                        {Number(selectedOrder?.tongtien).toLocaleString()}₫
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 bg-light">
          <Button variant="outline-secondary" className="px-4 rounded-pill" onClick={() => setShowModal(false)}>Đóng lại</Button>
          <Button variant="success" className="px-4 rounded-pill shadow-sm" onClick={() => window.print()}>In hóa đơn</Button>
        </Modal.Footer>
      </Modal>

      <Footer />

      <style>{`
        .order-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #eee;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .cart-style-table th {
          border: none;
          padding: 15px 10px;
          font-weight: 700;
          color: #2e7d32;
        }
        .cart-style-table td {
          border-bottom: 1px solid #f8f9fa;
        }
        .order-detail-modal .modal-content {
           border-radius: 20px;
           overflow: hidden;
           border: none;
        }
      `}</style>
    </div>
  );
}

export default Orders;
