import { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Form } from "react-bootstrap";
import { FaUserSlash, FaUserCheck, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getCustomers, updateCustomerStatus, updateCustomer } from "../api/khachhang";

function AdminCustomers() {
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal Edit state
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState({
    ma_kh: "",
    ten_kh: "",
    email: "",
    sodienthoai: "",
    diachi: ""
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không thể tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const toggleBlockStatus = async (customer) => {
    if (currentUser?.vai_tro !== "admin") {
      alert("Chỉ hệ thống trưởng (Admin) mới có quyền chặn người dùng.");
      return;
    }
    const newStatus = customer.trangthai === 'blocked' ? 'active' : 'blocked';
    const action = newStatus === 'blocked' ? "CHẶN" : "MỞ CHẶN";

    if (window.confirm(`Bạn có chắc muốn ${action} khách hàng ${customer.ten_kh}?`)) {
      try {
        await updateCustomerStatus(customer.ma_kh, newStatus);
        loadCustomers();
      } catch (err) {
        alert(err.response?.data?.error || "Lỗi khi cập nhật trạng thái");
      }
    }
  };

  const handleEditInit = (customer) => {
    setEditingCustomer({
      ...customer,
      email: customer.email_taikhoan || "",
      sodienthoai: customer.sdt_taikhoan || "",
      diachi: customer.diachi_taikhoan || ""
    });
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(editingCustomer.ma_kh, editingCustomer);
      alert("Cập nhật thông tin khách hàng thành công!");
      setShowModal(false);
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.error || "Lỗi khi cập nhật");
    }
  };

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="success" />
      <p className="mt-3">Đang tải dữ liệu...</p>
    </Container>
  );

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">🛒 Quản lý Khách hàng</h2>
        <span className="text-muted italic">Danh sách những người đã mua hàng tại shop (Có đơn hàng)</span>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-success text-white">
            <tr>
              <th className="py-3 ps-4">ID</th>
              <th className="py-3">Họ Tên</th>
              <th className="py-3">Tài khoản (Người đặt)</th>
              <th className="py-3">Người nhận (Đơn cuối)</th>
              <th className="py-3 text-center">Trạng Thái</th>
              <th className="py-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.ma_kh} className={c.trangthai === 'blocked' ? 'table-light opacity-75' : ''}>
                <td className="ps-4 align-middle x-small text-muted" style={{ fontSize: '0.7rem' }}>{c.ma_kh}</td>
                <td className="align-middle fw-bold">{c.ten_kh}</td>
                <td className="align-middle">
                  <div className="small fw-bold text-success">{(c.email_taikhoan || c.email) || "—"}</div>
                  <div className="text-muted small">{(c.sdt_taikhoan || c.sodienthoai) || "—"}</div>
                </td>
                <td className="align-middle">
                  <div className="fw-bold small">{c.ten_nhan_cuoi}</div>
                  <div className="small text-primary">{c.email_nhan_cuoi}</div>
                  <div className="small text-muted">{c.sdt_nhan_cuoi}</div>
                  <div className="text-muted italic" style={{ fontSize: '0.75rem' }}>{c.diachi_nhan_cuoi}</div>
                </td>
                <td className="align-middle text-center">
                  <Badge
                    pill
                    bg={c.trangthai === 'blocked' ? 'danger' : 'success'}
                    className="px-3 py-2"
                  >
                    {c.trangthai === 'blocked' ? 'Khóa' : 'Hoạt động'}
                  </Badge>
                </td>
                <td className="text-center align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditInit(c)}
                      title="Chỉnh sửa thông tin"
                    >
                      <FaEdit /> Sửa
                    </Button>

                    {currentUser?.vai_tro === "admin" && (
                      <Button
                        variant={c.trangthai === 'blocked' ? "success" : "danger"}
                        size="sm"
                        onClick={() => toggleBlockStatus(c)}
                        title={c.trangthai === 'blocked' ? "Mở chặn" : "Chặn tài khoản"}
                      >
                        {c.trangthai === 'blocked' ? <FaUserCheck /> : <FaUserSlash />}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">
                  Chưa có khách hàng nào đặt hàng.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal Chỉnh sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa khách hàng</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Họ và Tên</Form.Label>
              <Form.Control
                type="text"
                value={editingCustomer.ten_kh}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, ten_kh: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editingCustomer.email}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={editingCustomer.sodienthoai}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, sodienthoai: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={editingCustomer.diachi}
                onChange={(e) => setEditingCustomer({ ...editingCustomer, diachi: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="success" type="submit">Lưu thay đổi</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default AdminCustomers;