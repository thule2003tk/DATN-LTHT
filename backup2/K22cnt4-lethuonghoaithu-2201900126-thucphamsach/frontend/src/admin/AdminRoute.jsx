import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ⏳ Chờ load user
  if (loading) return <div>Đang kiểm tra quyền truy cập...</div>;

  // ❌ Chưa đăng nhập
  if (!user) {
    alert("Vui lòng đăng nhập!");
    return <Navigate to="/login" replace />;
  }

  // ❌ Không đủ quyền
  if (user.vai_tro !== "admin" && user.vai_tro !== "member") {
    alert("Bạn không có quyền truy cập trang quản trị!");
    return <Navigate to="/" replace />;
  }

  // ✅ OK
  return children;
};

export default AdminRoute;
