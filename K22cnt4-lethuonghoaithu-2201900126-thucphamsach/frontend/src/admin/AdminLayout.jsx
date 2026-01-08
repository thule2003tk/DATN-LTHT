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
            <li><Link to="/admin" className="nav-link text-white py-2">📊 Tổng quan</Link></li>
            <li><Link to="/admin/products" className="nav-link text-white py-2">🥬 Sản phẩm</Link></li>
            <li><Link to="/admin/orders" className="nav-link text-white py-2">📦 Đơn hàng</Link></li>
            <li><Link to="/admin/customers" className="nav-link text-white py-2">👥 Khách hàng</Link></li>
            <li><Link to="/admin/suppliers" className="nav-link text-white py-2">🏭 Nhà cung cấp</Link></li>
            <li><Link to="/admin/promotions" className="nav-link text-white py-2">🎁 Khuyến mãi</Link></li>
            <li><Link to="/admin/contacts" className="nav-link text-white py-2">✉️ Liên hệ</Link></li>
            <li><Link to="/admin/users" className="nav-link text-white py-2">👤 Người dùng</Link></li>
            
            {/* THÊM MENU MỚI - QUẢN LÝ BLOG */}
            <li className="border-top border-light mt-2 pt-3">
              <Link to="/admin/blog" className="nav-link text-white py-2 fw-bold">
                📝 Blog / Kiến thức
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 mt-auto border-top border-light">
          <button onClick={handleLogout} className="btn btn-outline-light w-100">
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      <div className="flex-grow-1 bg-light">
        <header className="bg-white px-4 py-3 border-bottom shadow-sm">
          <h4 className="text-success mb-0">Trang quản trị - Thực Phẩm Sạch</h4>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;