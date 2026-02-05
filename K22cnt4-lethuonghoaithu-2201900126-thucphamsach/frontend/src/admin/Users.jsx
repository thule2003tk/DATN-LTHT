import { useEffect, useState } from "react";
import { Table, Button, Alert, Badge, InputGroup, Form } from "react-bootstrap";
import { getUsers, updateUserRole, updateUserStatus } from "../api/adminUsers";
import { useAuth } from "../context/AuthContext";
import { FaUserSlash, FaUserCheck } from "react-icons/fa";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.ten_dangnhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (id, role) => {
    if (!window.confirm("Xác nhận đổi quyền?")) return;
    try {
      await updateUserRole(id, role);
      fetchUsers();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.error || "Không thể đổi quyền"));
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "blocked" ? "active" : "blocked";
    const msg = newStatus === "blocked" ? "CHẶN" : "MỞ CHẶN";

    if (!window.confirm(`Xác nhận ${msg} người dùng ${user.ten_dangnhap}?`)) return;

    try {
      await updateUserStatus(user.ma_nguoidung, newStatus);
      fetchUsers();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.error || "Không thể cập nhật trạng thái"));
    }
  };

  return (
    <div>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-success mb-0">👤 Quản lý người dùng</h2>

          <InputGroup style={{ maxWidth: "300px" }}>
            <InputGroup.Text className="bg-white border-end-0 text-success">
              🔍
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm tên đăng nhập, email..."
              className="border-start-0 shadow-none border-success-subtle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="bg-white rounded shadow-sm overflow-hidden">
          <Table hover responsive className="mb-0">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Tên đăng nhập</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <div className="text-muted fs-5">🔍 Không tìm thấy người dùng nào phù hợp</div>
                  </td>
                </tr>
              )}
              {filteredUsers.map((u, i) => (
                <tr key={u.ma_nguoidung} className={u.status === "blocked" ? "table-light opacity-75" : ""}>
                  <td>{i + 1}</td>
                  <td>{u.ten_dangnhap}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge
                      bg={u.vai_tro === "admin" ? "danger" : u.vai_tro === "staff" ? "warning" : "info"}
                      text={u.vai_tro === "staff" ? "dark" : "white"}
                    >
                      {!u.vai_tro || u.vai_tro === "member" ? "MEMBER" : u.vai_tro.toUpperCase()}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={u.status === "blocked" ? "danger" : "success"}>
                      {u.status === "blocked" ? "Đã chặn" : "Hoạt động"}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      {/* Admin mới được đổi Role và Block */}
                      {currentUser.vai_tro === "admin" && u.ma_nguoidung !== currentUser.ma_nguoidung && (
                        <>
                          {(!u.vai_tro || u.vai_tro === "member" || u.vai_tro === "customer") ? (
                            <Button size="sm" variant="outline-success" onClick={() => handleRoleChange(u.ma_nguoidung, "staff")}>
                              Duyệt Staff
                            </Button>
                          ) : u.vai_tro === "staff" ? (
                            <Button size="sm" variant="outline-warning" onClick={() => handleRoleChange(u.ma_nguoidung, "member")}>
                              Hạ quyền Member
                            </Button>
                          ) : null}

                          <Button
                            size="sm"
                            variant={u.status === "blocked" ? "success" : "danger"}
                            onClick={() => handleToggleStatus(u)}
                            title={u.status === "blocked" ? "Mở chặn" : "Chặn tài khoản"}
                          >
                            {u.status === "blocked" ? <FaUserCheck /> : <FaUserSlash />}
                          </Button>
                        </>
                      )}
                      {u.ma_nguoidung === currentUser.ma_nguoidung && <small className="text-muted italic">Đang online</small>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Users;
