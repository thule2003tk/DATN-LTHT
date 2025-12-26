import { useEffect, useState } from "react";
import { getGioHang, updateCart, deleteCart } from "../api/giohang.js";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const ma_kh = "KH01"; // test tạm thời
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    const data = await getGioHang(ma_kh);
    setCart(data);
    setLoading(false);
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdate = async (id, soluong) => { await updateCart(id, soluong); fetchCart(); };
  const handleDelete = async (id) => { await deleteCart(id); fetchCart(); };

  const totalPrice = cart.reduce((sum, item) => sum + item.soluong * item.gia, 0);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="container mt-4">
      <h1>Giỏ hàng</h1>
      {cart.length === 0 ? <p>Giỏ hàng trống</p> : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.ma_giohang}>
                  <td>{item.ten_sp}</td>
                  <td>{item.gia.toLocaleString()}₫</td>
                  <td>
                    <input type="number" value={item.soluong} min="1"
                      onChange={e => handleUpdate(item.ma_giohang, parseInt(e.target.value))} />
                  </td>
                  <td>{(item.gia*item.soluong).toLocaleString()}₫</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.ma_giohang)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Tổng cộng: {totalPrice.toLocaleString()}₫</h3>
          <button className="btn btn-success" onClick={() => navigate("/checkout")}>Thanh toán</button>
        </>
      )}
    </div>
  );
}

export default Cart;
