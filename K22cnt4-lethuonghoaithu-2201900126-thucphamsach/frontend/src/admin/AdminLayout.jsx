import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-success text-white d-flex flex-column sticky-top"
        style={{ width: "280px", height: "100vh", overflowY: "auto" }}
      >
        <div className="p-4 text-center border-bottom border-light flex-shrink-0">
          <h3 className="mb-0">ADMIN - THU</h3>
          <small>Thực Phẩm Sạch</small>
        </div>

        <nav className="mt-2 flex-grow-1">
          <ul className="nav flex-column px-2">
            {/* Các mục chính */}
            <li className="mb-1">
              <Link to="/admin" className="nav-link text-white py-2 hover-bg">
                📊 Tổng quan
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Quản lý kho</li>
            <li className="mb-1">
              <Link to="/admin/danhmuc" className="nav-link text-white py-2 hover-bg">
                📁 Danh mục
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/products" className="nav-link text-white py-2 hover-bg">
                🥬 Sản phẩm
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/donvisanpham" className="nav-link text-white py-2 hover-bg">
                ⚖️ Giá đơn vị
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/donvitinh" className="nav-link text-white py-2 hover-bg">
                ⚖️ Đơn vị
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Kinh doanh</li>
            <li className="mb-1">
              <Link to="/admin/orders" className="nav-link text-white py-2 hover-bg">
                📦 Đơn hàng
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/promotions" className="nav-link text-white py-2 hover-bg">
                🎁 Khuyến mãi
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Đối tác & Liên hệ</li>
            <li className="mb-1">
              <Link to="/admin/customers" className="nav-link text-white py-2 hover-bg">
                👥 Thành viên
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/suppliers" className="nav-link text-white py-2 hover-bg">
                🏭 Nhà cung cấp
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/contacts" className="nav-link text-white py-2 hover-bg">
                ✉️ Liên hệ
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Nội dung & Hệ thống</li>
            <li className="mb-1">
              <Link to="/admin/blog" className="nav-link text-white py-2 hover-bg">
                📝 Blog & Tin tức
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/users" className="nav-link text-white py-2 hover-bg">
                👤 Người dùng
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 mt-auto border-top border-light flex-shrink-0">
          <button onClick={handleLogout} className="btn btn-outline-light w-100">
            🚪 Đăng xuất
          </button>
        </div>

        <style>{`
          .hover-bg:hover { background: rgba(255,255,255,0.1); border-radius: 8px; }
          .nav-link { transition: all 0.2s; }
          .nav-header { letter-spacing: 1px; font-weight: 700; color: #e0e0e0; }
          /* Tùy chỉnh thanh cuộn cho Sidebar */
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        `}</style>
      </div>

      {/* Main content */}
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
