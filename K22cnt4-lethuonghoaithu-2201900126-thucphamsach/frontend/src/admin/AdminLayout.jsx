import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <div className="bg-success text-white" style={{ width: "280px" }}>
        <div className="p-4 text-center border-bottom border-light">
          <h3 className="mb-0">ADMIN - THU</h3>
          <small>Thực Phẩm Sạch</small>
        </div>

        <nav className="mt-4">
          <ul className="nav flex-column px-3">
            <li><Link to="/admin" className="nav-link text-white">Tổng quan</Link></li>
            <li><Link to="/admin/products" className="nav-link text-white">Sản phẩm</Link></li>
            <li><Link to="/admin/orders" className="nav-link text-white">Đơn hàng</Link></li>
            <li><Link to="/admin/customers" className="nav-link text-white">Khách hàng</Link></li>
            <li className="nav-item"><Link to="/admin/users" className="nav-link text-white">Người dùng</Link></li>
            <li><Link to="/admin/suppliers" className="nav-link text-white">Nhà cung cấp</Link></li>
            <li><Link to="/admin/promotions" className="nav-link text-white">Khuyến mãi</Link></li>
            <li><Link to="/admin/contacts" className="nav-link text-white">Liên hệ</Link></li>
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="btn btn-outline-light w-100">
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-grow-1 bg-light">
        <header className="bg-white px-4 py-3 border-bottom">
          <h4 className="text-success">Trang quản trị</h4>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
