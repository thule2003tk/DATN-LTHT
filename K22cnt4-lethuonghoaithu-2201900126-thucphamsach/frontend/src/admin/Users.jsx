import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole, deleteUser } from "../api/adminUsers";
import { useAuth } from "../context/AuthContext";

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApproveMember = async (id) => {
    await updateUserRole(id, "member");
    loadUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xoá người dùng này?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-success">Quản lý người dùng</h3>

      <table className="table table-bordered bg-white">
        <thead className="table-success">
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.ma_nguoidung}>
              <td>{u.ma_nguoidung}</td>
              <td>{u.ten_dangnhap}</td>
              <td>{u.email}</td>
              <td>{u.hoten}</td>
              <td>
                <span className={
                  u.vai_tro === "admin"
                    ? "badge bg-danger"
                    : u.vai_tro === "member"
                    ? "badge bg-warning text-dark"
                    : "badge bg-secondary"
                }>
                  {u.vai_tro}
                </span>
              </td>
              <td>
                {/* Admin duyệt member */}
                {user.vai_tro === "admin" && u.vai_tro === "customer" && (
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleApproveMember(u.ma_nguoidung)}
                  >
                    Duyệt member
                  </button>
                )}

                {/* Chỉ admin được xoá */}
                {user.vai_tro === "admin" && u.vai_tro !== "admin" && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(u.ma_nguoidung)}
                  >
                    Xoá
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
