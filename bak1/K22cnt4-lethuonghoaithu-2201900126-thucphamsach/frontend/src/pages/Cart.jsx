import { Link, useNavigate } from "react-router-dom"; // THÊM useNavigate
import { Container, Button, Table } from "react-bootstrap";
import { FaHome } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { categories } from "../data/categories.js";

function Cart() {
  const { cart, updateCart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate(); // THÊM DÒNG NÀY

  if (cart.length === 0) {
    return (
      <Container className="my-5 py-5 text-center">
        <h1 className="text-success mb-5">Giỏ Hàng Của Bạn</h1>
        <p className="fs-4 text-muted">Giỏ hàng trống</p>
        <Button variant="success" size="lg" as={Link} to="/">
          <FaHome className="me-2" /> Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  const handleCheckout = () => {
    navigate("/checkout"); // CHUYỂN SANG TRANG THANH TOÁN
  };

  return (
    <>
      <Header categories={categories} />
      <Container className="my-5 py-5">
        <h1 className="text-center mb-5 text-success">Giỏ Hàng Của Bạn</h1>

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
              <tr key={item.ma_sp}>
                <td>{item.ten_sp}</td>
                <td>{item.gia.toLocaleString()}₫</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateCart(item.ma_sp, e.target.value)}
                  />
                </td>
                <td>{(item.gia * item.quantity).toLocaleString()}₫</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item.ma_sp)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <h3 className="text-end">Tổng cộng: {totalPrice.toLocaleString()}₫</h3>

        <div className="text-end mt-4">
          <Button
            variant="success"
            size="lg"
            onClick={handleCheckout} // GỌI HÀM CHUYỂN TRANG
          >
            Thanh toán
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button variant="outline-success" size="lg" as={Link} to="/">
            <FaHome className="me-2" /> Trở về Trang Chủ
          </Button>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Cart;