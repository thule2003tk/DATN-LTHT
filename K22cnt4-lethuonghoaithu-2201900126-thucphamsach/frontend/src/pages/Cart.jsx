import { useEffect, useState } from "react";
import { getGioHang, updateCart, deleteCart } from "../api/giohang";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { FaHome } from "react-icons/fa";

// THÊM useAuth ĐỂ BẢO VỆ TRANG GIỎ HÀNG
import { useAuth } from "../context/AuthContext.jsx";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // KIỂM TRA LOGIN
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

  const totalPrice = cart.reduce((sum, item) => sum + item.soluong * item.gia, 0);

  if (loading) return <div className="container mt-5 text-center"><h4 className="text-success">Đang tải giỏ hàng...</h4></div>;

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
          <Row>
            <Col lg={8} md={10} className="mx-auto">
              <Table striped bordered hover responsive className="table-success">
                <thead className="table-dark">
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.ma_giohang}>
                      <td>{item.ten_sp}</td>
                      <td>{item.gia.toLocaleString("vi-VN")}₫</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          className="form-control w-75"
                          value={item.soluong}
                          onChange={(e) =>
                            updateCart(item.ma_giohang, Number(e.target.value)).then(() => {
                              const fetchCart = async () => {
                                const data = await getGioHang();
                                setCart(data);
                              };
                              fetchCart();
                            })
                          }
                        />
                      </td>
                      <td>{(item.gia * item.soluong).toLocaleString("vi-VN")}₫</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            deleteCart(item.ma_giohang).then(() => {
                              const fetchCart = async () => {
                                const data = await getGioHang();
                                setCart(data);
                              };
                              fetchCart();
                            })
                          }
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end mt-4">
                <h3 className="text-success">
                  Tổng cộng: <strong>{totalPrice.toLocaleString("vi-VN")}₫</strong>
                </h3>
                <Button
                  variant="success"
                  size="lg"
                  className="mt-3"
                  onClick={() => navigate("/checkout")}
                >
                  Thanh toán ngay
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Cart;