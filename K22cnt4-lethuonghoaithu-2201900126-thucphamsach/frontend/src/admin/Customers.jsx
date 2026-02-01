import { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner, Badge, Modal } from "react-bootstrap";
import { FaUserSlash, FaUserCheck, FaEdit } from "react-icons/fa";

const API_URL = "http://localhost:3001/api/khachhang";

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

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

  if (loading) return (
    <Container className="text-center py-5">
      <Spinner animation="border" variant="success" />
      <p className="mt-3">Đang tải dữ liệu...</p>
    </Container>
  );

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-success fw-bold">🛡️ Quản lý Khách Hàng</h2>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="bg-white rounded-3 shadow-sm overflow-hidden">
        <Table hover responsive className="mb-0">
          <thead className="bg-success text-white">
            <tr>
              <th className="py-3 ps-4">Mã KH</th>
              <th className="py-3">Họ Tên</th>
              <th className="py-3">Liên Hệ</th>
              <th className="py-3">Địa Chỉ</th>
              <th className="py-3">Trạng Thái</th>
              <th className="py-3 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.ma_kh} className={c.trangthai === 'blocked' ? 'table-light' : ''}>
                <td className="ps-4 align-middle">{c.ma_kh}</td>
                <td className="align-middle fw-bold">{c.ten_kh}</td>
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
                  <Button
                    variant="link"
                    className="text-primary p-0 me-3"
                    onClick={() => handleEditInit(c)}
                    title="Chỉnh sửa"
                  >
                    <FaEdit size={18} />
                  </Button>
                  <Button
                    variant={c.trangthai === 'blocked' ? "outline-success" : "outline-danger"}
                    size="sm"
                    className="rounded-pill px-3"
                    onClick={() => toggleBlockStatus(c)}
                  >
                    {c.trangthai === 'blocked' ? (
                      <><FaUserCheck className="me-1" /> Mở chặn</>
                    ) : (
                      <><FaUserSlash className="me-1" /> Chặn tài khoản</>
                    )}
                  </Button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-5 text-muted">
                  Không có dữ liệu khách hàng.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal chỉnh sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fs-5">Chỉnh sửa khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 text-center">
          <div className="mb-3 fs-1 text-warning">🛠️</div>
          <h5>Tính năng đang được hoàn thiện</h5>
          <p className="text-muted">Bạn có thể dùng nút <b>Chặn tài khoản</b> để tạm dừng hoạt động của khách hàng này ngay lập tức.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} className="px-4">Đóng</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminCustomers;