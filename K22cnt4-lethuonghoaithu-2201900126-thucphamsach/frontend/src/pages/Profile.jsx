import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user } = useAuth(); // lấy user hiện tại
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hoten: user?.hoten || "",
    email: user?.email || "",
    sodienthoai: user?.sodienthoai || "",
    diachi: user?.diachi || "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Tạm thời lưu vào localStorage (sau này kết nối backend update profile)
    localStorage.setItem("user", JSON.stringify({ ...user, ...formData }));
    setMessage("Cập nhật thông tin thành công! 🌿");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <Container className="my-5 py-5">
      <h1 className="text-center mb-5 text-success fw-bold">Hồ Sơ Của Bạn</h1>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div className="bg-success text-white rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px", fontSize: "40px" }}>
                  {user.ten_dangnhap[0].toUpperCase()}
                </div>
                <h4 className="mt-3 text-success">{user.hoten || user.ten_dangnhap}</h4>
              </div>

              {message && <Alert variant="success" className="text-center">{message}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="hoten"
                    value={formData.hoten}
                    onChange={handleChange}
                    placeholder="Nhập họ tên"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="sodienthoai"
                    value={formData.sodienthoai}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    name="diachi"
                    value={formData.diachi}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ nhận hàng"
                  />
                </Form.Group>

                <div className="text-center">
                  <Button variant="success" size="lg" type="submit" className="px-5">
                    Cập Nhật Thông Tin
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Profile;