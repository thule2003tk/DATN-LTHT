import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Table, Card } from "react-bootstrap";
import { FaHome, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Cart() {
  const { cart, updateCart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <Container className="my-5 py-5 text-center">
          <h1 className="text-success mb-4">🛒 Giỏ Hàng Của Bạn</h1>
          <p className="fs-4 text-muted mb-4">Giỏ hàng hiện đang trống</p>
          <Button variant="success" size="lg" as={Link} to="/">
            <FaHome className="me-2" /> Tiếp tục mua sắm
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Container className="my-5">
        <h1 className="text-center text-success fw-bold mb-5">
          🛒 Giỏ Hàng Của Bạn
        </h1>

        <Row>
          {/* ===== DANH SÁCH SẢN PHẨM ===== */}
          <Col lg={8}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body>
                <Table responsive className="align-middle cart-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Giá</th>
                      <th className="text-center">Số lượng</th>
                      <th>Thành tiền</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => {
                      const img =
                        item.hinhanh?.startsWith("http")
                          ? item.hinhanh
                          : `http://localhost:3001/uploads/${item.hinhanh}`;

                      return (
                        <tr key={item.ma_sp}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={img}
                                alt={item.ten_sp}
                                className="cart-img"
                                onError={(e) =>
                                  (e.target.src = "/no-image.png")
                                }
                              />
                              <strong>{item.ten_sp}</strong>
                            </div>
                          </td>

                          <td className="text-success fw-bold">
                            {item.gia.toLocaleString()}₫
                          </td>

                          <td className="text-center">
                            <div className="qty-box">
                              <button
                                onClick={() =>
                                  updateCart(item.ma_sp, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                <FaMinus />
                              </button>

                              <span>{item.quantity}</span>

                              <button
                                onClick={() =>
                                  updateCart(item.ma_sp, item.quantity + 1)
                                }
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </td>

                          <td className="fw-bold">
                            {(item.gia * item.quantity).toLocaleString()}₫
                          </td>

                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeFromCart(item.ma_sp)}
                            >
                              <FaTrash />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* ===== TỔNG THANH TOÁN ===== */}
          <Col lg={4}>
            <Card className="shadow-sm border-0 cart-summary">
              <Card.Body>
                <h4 className="fw-bold mb-4">🧾 Tổng đơn hàng</h4>

                <div className="d-flex justify-content-between mb-3">
                  <span>Tạm tính</span>
                  <strong>{totalPrice.toLocaleString()}₫</strong>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span>Phí vận chuyển</span>
                  <strong className="text-success">Miễn phí</strong>
                </div>

                <hr />

                <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
                  <span>Tổng cộng</span>
                  <span className="text-success">
                    {totalPrice.toLocaleString()}₫
                  </span>
                </div>

                <Button
                  variant="success"
                  size="lg"
                  className="w-100 mb-3"
                  onClick={() => navigate("/checkout")}
                >
                  Thanh toán
                </Button>

                <Button
                  variant="outline-success"
                  className="w-100"
                  as={Link}
                  to="/"
                >
                  <FaHome className="me-2" /> Tiếp tục mua sắm
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />

      {/* ===== CSS ===== */}
      <style>{`
        body { background: #f7faf7; }

        .cart-table th {
          background: #f1f8f1;
          border: none;
          font-weight: 600;
        }

        .cart-table td {
          border-top: 1px solid #eee;
        }

        .cart-img {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .qty-box {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 4px 8px;
        }

        .qty-box button {
          background: none;
          border: none;
          color: #2e7d32;
          cursor: pointer;
        }

        .qty-box span {
          min-width: 24px;
          text-align: center;
          font-weight: 600;
        }

        .cart-summary {
          position: sticky;
          top: 120px;
        }
      `}</style>
    </>
  );
}

export default Cart;
