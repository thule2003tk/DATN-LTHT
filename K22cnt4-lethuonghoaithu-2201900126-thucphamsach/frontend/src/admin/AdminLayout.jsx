import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import adminNotificationApi from "../api/adminNotifications";
import { Badge, Dropdown, Nav } from "react-bootstrap";
import { FaBell, FaShoppingCart, FaUserPlus, FaExclamationTriangle } from "react-icons/fa";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const pollingRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper để lấy tên trang hiện tại dựa trên path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin") return "Tổng quan hệ thống";
    if (path.includes("/admin/danhmuc")) return "Quản lý Danh mục";
    if (path.includes("/admin/products")) return "Quản lý Sản phẩm";
    if (path.includes("/admin/donvisanpham")) return "Quản lý Giá đơn vị";
    if (path.includes("/admin/donvitinh")) return "Quản lý Đơn vị tính";
    if (path.includes("/admin/orders")) return "Quản lý Đơn hàng";
    if (path.includes("/admin/promotions")) return "Quản lý Khuyến mãi";
    if (path.includes("/admin/customers")) return "Quản lý Khách hàng";
    if (path.includes("/admin/suppliers")) return "Quản lý Nhà cung cấp";
    if (path.includes("/admin/contacts")) return "Quản lý Liên hệ";
    if (path.includes("/admin/news")) return "Quản lý Tin tức";
    if (path.includes("/admin/banners")) return "Quản lý Banner";
    if (path.includes("/admin/blog")) return "Quản lý Blog";
    if (path.includes("/admin/users")) return "Quản lý Người dùng";
    if (path.includes("/admin/notifications")) return "Tất cả thông báo";
    return "Trang quản trị";
  };

  const isActive = (path) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const fetchNotifications = async () => {
    try {
      const res = await adminNotificationApi.getNotifications();
      setNotifications(res.data || []);
      // Giả sử unreadCount là số lượng đơn hàng mới hoặc tồn kho thấp
      const count = (res.data || []).filter(n => n.type === 'order' || n.type === 'stock').length;
      setUnreadCount(count);
    } catch (err) {
      console.error("❌ [API ERROR] Lỗi lấy thông báo:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Polling mỗi 30 giây
    pollingRef.current = setInterval(fetchNotifications, 30000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
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
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ width: "80px", height: "auto", marginBottom: "15px", borderRadius: "10px", backgroundColor: "#fff", padding: "5px" }}
          />
          <h3 className="mb-0">ADMIN - THU</h3>
          <small>Thực Phẩm Sạch HTFood</small>
        </div>

        <nav className="mt-2 flex-grow-1">
          <ul className="nav flex-column px-2">
            {/* Các mục chính */}
            <li className="mb-1">
              <Link to="/admin" className={`nav-link text-white py-2 hover-bg ${isActive("/admin") ? "active-link" : ""}`}>
                📊 Tổng quan
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Quản lý kho</li>
            <li className="mb-1">
              <Link to="/admin/danhmuc" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/danhmuc") ? "active-link" : ""}`}>
                📁 Danh mục
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/products" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/products") ? "active-link" : ""}`}>
                🥬 Sản phẩm
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/donvisanpham" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/donvisanpham") ? "active-link" : ""}`}>
                ⚖️ Giá đơn vị
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/donvitinh" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/donvitinh") ? "active-link" : ""}`}>
                ⚖️ Đơn vị
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Kinh doanh</li>
            <li className="mb-1">
              <Link to="/admin/orders" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/orders") ? "active-link" : ""}`}>
                📦 Đơn hàng
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/promotions" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/promotions") ? "active-link" : ""}`}>
                🎁 Khuyến mãi
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Đối tác & Liên hệ</li>
            <li className="mb-1">
              <Link to="/admin/customers" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/customers") ? "active-link" : ""}`}>
                👥 Khách hàng
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/suppliers" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/suppliers") ? "active-link" : ""}`}>
                🏭 Nhà cung cấp
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/contacts" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/contacts") ? "active-link" : ""}`}>
                ✉️ Liên hệ
              </Link>
            </li>

            <li className="nav-header px-3 mt-3 mb-1 small text-uppercase opacity-75">Nội dung & Hệ thống</li>
            <li className="mb-1">
              <Link to="/admin/news" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/news") ? "active-link" : ""}`}>
                📰 Quản lý Tin tức
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/banners" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/banners") ? "active-link" : ""}`}>
                🖼️ Quản lý Banner
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/blog" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/blog") ? "active-link" : ""}`}>
                📝 Blog
              </Link>
            </li>
            <li className="mb-1">
              <Link to="/admin/users" className={`nav-link text-white py-2 hover-bg ${isActive("/admin/users") ? "active-link" : ""}`}>
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
          .hover-bg:hover { background: rgba(255,255,255,0.1); border-radius: 8px; transform: translateX(5px); }
          .nav-link { transition: all 0.3s ease; }
          .nav-header { letter-spacing: 1px; font-weight: 700; color: #e0e0e0; }
          .active-link { 
            background: rgba(255,255,255,0.2) !important; 
            border-left: 4px solid #fff; 
            border-radius: 0 8px 8px 0 !important;
            font-weight: bold;
            transform: translateX(5px);
          }
          .breadcrumb-item + .breadcrumb-item::before { content: "/"; color: #6c757d; }
          /* Tùy chỉnh thanh cuộn cho Sidebar */
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        `}</style>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        <header className="bg-white ps-4 pe-5 py-3 border-bottom shadow-sm d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 1000 }}>
          <div className="d-flex align-items-center gap-2 fs-5">
            <Link to="/admin" className="text-muted text-decoration-none hover-opacity">HTFood</Link>
            <span className="text-secondary">/</span>
            <span className="text-success fw-bold">{getPageTitle()}</span>
          </div>

          <div className="d-flex align-items-center gap-4 me-5">
            {/* Zen Clock */}
            <div className="text-end text-secondary d-none d-xl-block border-end pe-4 me-2" style={{ lineHeight: '1.2' }}>
              <div className="fw-bold text-dark" style={{ fontSize: '1.1rem text-uppercase' }}>
                {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <small style={{ fontSize: '0.75rem' }}>
                {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
              </small>
            </div>
            {/* Notification Bell */}
            <Dropdown align="end">
              <Dropdown.Toggle as={Nav.Link} className="p-0 position-relative">
                <FaBell size={22} className="text-secondary" />
                {unreadCount > 0 && (
                  <Badge
                    pill
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle"
                    style={{ fontSize: '0.65rem', padding: '0.25em 0.5em' }}
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow border-0 py-0 overflow-hidden" style={{ width: '320px' }}>
                {/* Header cố định */}
                <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Thông báo mới</h6>
                  <small className="text-success cursor-pointer" onClick={fetchNotifications}>Làm mới</small>
                </div>

                {/* Danh sách cuộn */}
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted">
                      <small>Không có thông báo nào mới</small>
                    </div>
                  ) : (
                    notifications.map((n, idx) => (
                      <Dropdown.Item
                        key={idx}
                        className="p-3 border-bottom d-flex align-items-start gap-3 whitespace-normal"
                        onClick={() => navigate(n.link)}
                      >
                        <div className={`rounded-circle p-2 bg-${n.type === 'order' ? 'primary' : (n.type === 'stock' ? 'warning' : 'info')} bg-opacity-10`}>
                          {n.type === 'order' && <FaShoppingCart className="text-primary" />}
                          {n.type === 'stock' && <FaExclamationTriangle className="text-warning" />}
                          {n.type === 'user' && <FaUserPlus className="text-info" />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div className="fw-bold small text-dark">{n.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{n.content}</div>
                          <small className="text-muted italic" style={{ fontSize: '0.7rem' }}>
                            {new Date(n.time).toLocaleString('vi-VN')}
                          </small>
                        </div>
                      </Dropdown.Item>
                    ))
                  )}
                </div>

                {/* Footer cố định */}
                <div className="p-2 text-center bg-light border-top sticky-bottom">
                  <Dropdown.Item
                    onClick={() => navigate("/admin/notifications")}
                    className="p-1 small text-primary bg-transparent text-center fw-bold"
                  >
                    Xem tất cả thông báo
                  </Dropdown.Item>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <div className="d-flex align-items-center gap-3 border-start ps-4">
              <div className="text-end d-none d-md-block">
                <div className="fw-bold text-dark">{sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")).ho_ten : "Quản trị viên"}</div>
                <small className="text-muted text-capitalize">{sessionStorage.getItem("role") || "Admin"}</small>
              </div>
              <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}>
                {(() => {
                  const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null;
                  return user?.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : "A";
                })()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
