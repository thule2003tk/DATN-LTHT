import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Table } from "react-bootstrap";
import { FaHome, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext.jsx";

function Checkout() {
  const { cart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <Container className="my-5 py-5 text-center">
        <h1 className="text-success mb-5 fw-bold">Thanh Toán Đơn Hàng</h1>
        <p className="fs-4 text-muted">Giỏ hàng trống</p>
        <Button variant="success" size="lg" as={Link} to="/">
          <FaHome className="me-2" /> Tiếp tục mua sắm
        </Button>
      </Container>
    );
  }

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Tạo đơn hàng mới
    const newOrder = {
      ma_donhang: "DH" + Date.now(), // mã đơn tạm thời
      date: new Date().toISOString(),
      items: cart,
      total: totalPrice,
      status: "Chờ xác nhận"
    };

    // Lưu vào localStorage (danh sách đơn hàng)
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    savedOrders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(savedOrders));

    // Xóa giỏ hàng sau khi đặt thành công
    localStorage.removeItem("cart");

    // Alert thành công
    alert(
      "Đặt hàng thành công! 🎉\n" +
      `Mã đơn hàng: ${newOrder.ma_donhang}\n` +
      `Tổng tiền: ${totalPrice.toLocaleString("vi-VN")}₫\n\n` +
      "Cảm ơn bạn đã mua sắm tại Thực Phẩm Sạch 🥬🌿\n" +
      "Chúng tôi sẽ liên hệ giao hàng sớm nhất!"
    );

    // Chuyển về trang chủ
    navigate("/");
  };

  return (
    <Container className="my-5 py-5">
      <h1 className="text-center mb-5 text-success fw-bold">Thanh Toán Đơn Hàng</h1>

      <Table striped bordered hover responsive className="table-success shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.ma_sp}>
              <td className="fw-medium">{item.ten_sp}</td>
              <td>{Number(item.gia).toLocaleString("vi-VN")}₫</td>
              <td className="text-center">{item.quantity}</td>
              <td className="fw-bold text-success">
                {(Number(item.gia) * item.quantity).toLocaleString("vi-VN")}₫
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="text-end mt-4">
        <h2 className="text-success">
          Tổng cộng: <strong className="text-danger fs-1">{totalPrice.toLocaleString("vi-VN")}₫</strong>
        </h2>
      </div>

      <div className="text-center mt-5 d-grid gap-3">
        <Button 
          variant="success" 
          size="lg" 
          className="px-5 py-3 fw-bold" 
          onClick={handleCheckout}
        >
          Xác Nhận Đặt Hàng
        </Button>

        <Button variant="outline-success" size="lg" as={Link} to="/cart">
          <FaShoppingCart className="me-2" /> Quay lại giỏ hàng
        </Button>

        <Button variant="outline-secondary" size="lg" as={Link} to="/">
          <FaHome className="me-2" /> Trở về Trang Chủ
        </Button>
      </div>
    </Container>
  );
}

export default Checkout;