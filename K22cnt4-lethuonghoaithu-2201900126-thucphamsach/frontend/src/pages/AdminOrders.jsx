import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus, getOrderDetail } from "../api/donhang.js";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // xem chi tiết đơn

  const fetchOrders = async () => {
    setLoading(true);
    const data = await getAllOrders();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewDetail = async (ma_donhang) => {
    const data = await getOrderDetail(ma_donhang);
    setSelectedOrder(data);
  };

  const handleStatusChange = async (ma_donhang, newStatus) => {
    await updateOrderStatus(ma_donhang, newStatus);
    fetchOrders();
    if (selectedOrder) setSelectedOrder(null); // đóng chi tiết sau khi cập nhật
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="container mt-4">
      <h1>Quản lý đơn hàng</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.ma_donhang}>
              <td>{order.ma_donhang}</td>
              <td>{order.ten_kh}</td>
              <td>{new Date(order.ngay_dat).toLocaleString()}</td>
              <td>{order.tongtien.toLocaleString()}₫</td>
              <td>{order.trangthai}</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleViewDetail(order.ma_donhang)}
                >
                  Xem chi tiết
                </button>
                <select
                  value={order.trangthai}
                  onChange={(e) => handleStatusChange(order.ma_donhang, e.target.value)}
                  className="form-select d-inline-block"
                  style={{ width: "150px" }}
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đang giao">Đang giao</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Hủy">Hủy</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="mt-4">
          <h3>Chi tiết đơn hàng: {selectedOrder.ma_donhang}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item) => (
                <tr key={item.ma_sp}>
                  <td>{item.ten_sp}</td>
                  <td>{item.dongia.toLocaleString()}₫</td>
                  <td>{item.soluong}</td>
                  <td>{(item.dongia * item.soluong).toLocaleString()}₫</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;
