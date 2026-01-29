import { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner } from "react-bootstrap";

// API lấy danh sách khách hàng (tách riêng cho dễ bảo trì)
const fetchCustomers = async () => {
  const response = await fetch("http://localhost:3001/api/khachhang", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Nếu cần auth admin: Authorization: `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Lỗi ${response.status}`);
  }

  return await response.json();
};

function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchCustomers();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu trả về không phải mảng");
        }
        setCustomers(data);
      } catch (err) {
        console.error("Lỗi tải khách hàng:", err);
        setError(err.message || "Không thể tải danh sách khách hàng. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // Hàm xử lý xóa khách hàng (tạm thời chỉ alert - bạn có thể mở rộng sau)
  const handleDelete = (ma_kh) => {
    if (window.confirm(`Bạn chắc chắn muốn xóa khách hàng ${ma_kh}?`)) {
      alert(`Đã xóa khách hàng ${ma_kh} (chức năng này đang phát triển)`);
      // Sau này gọi API DELETE /api/khachhang/${ma_kh}
      // rồi refresh danh sách
    }
  };

  // Hàm xử lý sửa (tạm thời alert)
  const handleEdit = (customer) => {
    alert(`Sửa thông tin khách hàng ${customer.ma_kh}: ${customer.ten_kh}`);
    // Sau này mở modal form chỉnh sửa
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Đang tải danh sách khách hàng...</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-success mb-4 fw-bold">Quản lý Khách Hàng</h2>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {customers.length === 0 ? (
        <Alert variant="info" className="text-center">
          Chưa có khách hàng nào trong hệ thống.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="table-success shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Mã KH</th>
              <th>Tên khách hàng</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.ma_kh}>
                <td>{customer.ma_kh}</td>
                <td>{customer.ten_kh}</td>
                <td>{customer.email}</td>
                <td>{customer.sodienthoai}</td>
                <td>{customer.diachi}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(customer)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(customer.ma_kh)}
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default AdminCustomers;