import { useEffect, useState } from "react";
import { getGioHang, updateCart, deleteCart } from "../api/giohang";
import { useNavigate, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FaHome } from "react-icons/fa";

// THÊM useAuth
import { useAuth } from "../context/AuthContext.jsx";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // THÊM KIỂM TRA LOGIN
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const data = await getGioHang();
        setCart(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user, navigate]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.soluong * item.gia,
    0
  );

  if (loading) return <div className="text-center py-5"><h4>Đang tải giỏ hàng...</h4></div>;

  return (
    <Container className="my-5 py-5">
      <h1 className="text-center mb-5 text-success">Giỏ Hàng Của Bạn</h1>

      {cart.length === 0 ? (
        <div className="text-center py-5">
          <p className="fs-4 text-muted">Giỏ hàng trống</p>
          <Button variant="success" size="lg" as={Link} to="/">
            <FaHome className="me-2" /> Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.ma_giohang}>
                  <td>{item.ten_sp}</td>
                  <td>{item.gia.toLocaleString()}₫</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.soluong}
                      onChange={e =>
                        updateCart(item.ma_giohang, Number(e.target.value))
                          .then(() => fetchCart())
                      }
                    />
                  </td>
                  <td>{(item.gia * item.soluong).toLocaleString()}₫</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        deleteCart(item.ma_giohang).then(() => fetchCart())
                      }
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-end">Tổng cộng: {totalPrice.toLocaleString()}₫</h3>

          <div className="text-end mt-4">
            <Button
              variant="success"
              size="lg"
              onClick={() => navigate("/checkout")}
            >
              Thanh toán
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;