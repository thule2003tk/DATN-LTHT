function AdminDashboard() {
  return (
    <div>
      <h2 className="mb-4 text-success">Tổng quan hệ thống</h2>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-cart-check text-success fs-1 mb-3"></i>
              <h4>156</h4>
              <p className="text-muted mb-0">Đơn hàng hôm nay</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-currency-dollar text-primary fs-1 mb-3"></i>
              <h4>48.500.000 ₫</h4>
              <p className="text-muted mb-0">Doanh thu tháng này</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-people text-info fs-1 mb-3"></i>
              <h4>1.234</h4>
              <p className="text-muted mb-0">Khách hàng</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="bi bi-box-seam text-warning fs-1 mb-3"></i>
              <h4>89</h4>
              <p className="text-muted mb-0">Sản phẩm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4>Chào mừng bạn đến với trang quản trị!</h4>
        <p>Hãy chọn menu bên trái để bắt đầu quản lý.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;