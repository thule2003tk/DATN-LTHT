import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Table, Alert, Badge } from "react-bootstrap";
import axios from "axios";

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      const res = await axios.get(
        `http://localhost:3001/api/donhang/khach/${user.ma_kh}`
      );
      setOrders(res.data);
    };

    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <Container className="my-5">
      <h2 className="text-center text-success fw-bold">
        Lịch Sử Đơn Hàng
      </h2>

      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          Bạn chưa có đơn hàng nào
        </Alert>
      ) : (
        <Table bordered hover className="mt-4">
          <thead className="table-dark">
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.ma_donhang}>
                <td>{o.ma_donhang}</td>
                <td>{new Date(o.ngay_dat).toLocaleDateString("vi-VN")}</td>
                <td className="fw-bold text-success">
                  {Number(o.tongtien).toLocaleString()}₫
                </td>
                <td>
                  <Badge
                    bg={
                      o.trangthai === "Đang giao hàng"
                        ? "success"
                        : "warning"
                    }
                  >
                    {o.trangthai}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default Orders;
