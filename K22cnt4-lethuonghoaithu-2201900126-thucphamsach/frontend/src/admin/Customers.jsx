import { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner, Badge, Modal, Form } from "react-bootstrap";
import { FaUserSlash, FaUserCheck, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3001/api/khachhang";

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
      const res = await fetch(API_URL);
      const data = await res.json();
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
        const res = await fetch(`${API_URL}/${customer.ma_kh}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trangthai: newStatus })
        });
        if (res.ok) {
          loadCustomers();
        } else {
          alert("Lỗi khi cập nhật trạng thái");
        }
      } catch (err) {
        alert("Lỗi kết nối server");
      }
    }
  };

  const handleEditInit = (customer) => {
    setEditingCustomer({ ...customer });
    setShowModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${editingCustomer.ma_kh}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCustomer)
      });
      if (res.ok) {
        alert("Cập nhật thông tin khách hàng thành công!");
        setShowModal(false);
        loadCustomers();
      } else {
        alert("Lỗi khi cập nhật");
      }
    } catch (err) {
      alert("Lỗi kết nối");
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
        <h2 className="text-success fw-bold">🛒 Quản lý Khách Hàng (Đã đặt hàng)</h2>
        <span className="text-muted italic">Danh sách những người đã mua hàng tại shop</span>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-success text-white">
            <tr>
              <th className="py-3 ps-4">Mã KH</th>
              <th className="py-3">Họ Tên</th>
              <th className="py-3">Vai Trò</th>
              <th className="py-3">Liên Hệ</th>
              <th className="py-3">Địa Chỉ</th>
              <th className="py-3">Trạng Thái</th>
              <th className="py-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.ma_kh} className={c.trangthai === 'blocked' ? 'table-light opacity-75' : ''}>
                <td className="ps-4 align-middle">{c.ma_kh}</td>
                <td className="align-middle fw-bold">{c.ten_kh}</td>
                <td className="align-middle">
                  <Badge bg={c.vai_tro === "staff" ? "warning" : "info"} text="dark">
                    {c.vai_tro === "staff" ? "Nhân viên" : "Khách hàng"}
                  </Badge>
                </td>
                <td className="align-middle">
                  <div className="small">{c.email}</div>
                  <div className="text-muted small">{c.sodienthoai}</div>
                </td>
                <td className="align-middle small">{c.diachi}</td>
                <td className="align-middle">
                  <Badge
                    pill
                    bg={c.trangthai === 'blocked' ? 'danger' : 'success'}
                    className="px-3 py-2"
                  >
                    {c.trangthai === 'blocked' ? 'Đã chặn' : 'Đang hoạt động'}
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