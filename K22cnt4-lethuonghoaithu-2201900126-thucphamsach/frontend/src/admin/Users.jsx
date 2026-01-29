import { useEffect, useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { getUsers, updateUserRole } from "../api/adminUsers";
import { useAuth } from "../context/AuthContext";

function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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

  const handleRoleChange = async (id, role) => {
    if (!window.confirm("Xác nhận đổi quyền?")) return;

    await updateUserRole(id, role);
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-success mb-4">Quản lý người dùng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover>
        <thead className="table-success">
          <tr>
            <th>#</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Duyệt</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.ma_nguoidung}>
              <td>{i + 1}</td>
              <td>{u.ten_dangnhap}</td>
              <td>{u.email}</td>
              <td>
                <b>{u.vai_tro}</b>
              </td>
              <td>
                {user.vai_tro === "admin" && u.vai_tro === "customer" && (
                  <Button
                    size="sm"
                    onClick={() => handleRoleChange(u.ma_nguoidung, "staff")}
                  >
                    Duyệt Staff
                  </Button>
                )}

                {user.vai_tro === "admin" && u.vai_tro === "staff" && (
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleRoleChange(u.ma_nguoidung, "customer")}
                  >
                    Hạ quyền
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Users;
