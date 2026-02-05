import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Container, Card, Form, Button, Alert, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    hoten: "",
    email: "",
    sodienthoai: "",
    diachi: ""
  });
  const [message, setMessage] = useState("");

  // Lấy thông tin user từ backend khi component load
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    async function fetchProfile() {
      try {
        const res = await axiosClient.get(`/auth/profile`);
        setFormData({
          hoten: res.data.hoten || "",
          email: res.data.email || "",
          sodienthoai: res.data.sodienthoai || "",
          diachi: res.data.diachi || ""
        });
      } catch (err) {
        console.error("Lỗi fetch profile:", err);
      }
    }
    fetchProfile();
  }, [user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gọi API cập nhật thông qua axiosClient
      const res = await axiosClient.put(`/auth/${user.ma_nguoidung}`, formData);

      setMessage("Cập nhật thành công! 🌿");

      // Cập nhật thông tin trong AuthContext
      setUser(res.data);

      // Lưu lại thông tin vào sessionStorage để đồng bộ các trang khác
      sessionStorage.setItem("user", JSON.stringify(res.data));

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Cập nhật thất bại!");
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />
      <Container className="my-5 py-5">
        <h1 className="text-center mb-5 text-success fw-bold">Hồ Sơ Của Bạn</h1>
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="bg-success text-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{ width: "100px", height: "100px", fontSize: "40px" }}>
                    {user.ten_dangnhap ? user.ten_dangnhap[0].toUpperCase() : "U"}
                  </div>
                  <h4 className="mt-3 text-success">{user.hoten || user.ten_dangnhap}</h4>
                  <Badge bg={user.vai_tro === "admin" ? "danger" : "info"} className="mt-1">
                    Vai trò: {user.vai_tro === "admin" ? "Quản trị viên" : (user.vai_tro === "staff" ? "Nhân viên" : "Thành viên")}
                  </Badge>
                </div>

                {message && <Alert variant="success" className="text-center">{message}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control type="text" name="hoten" value={formData.hoten} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} disabled />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control type="text" name="sodienthoai" value={formData.sodienthoai} onChange={handleChange} />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Địa chỉ</Form.Label>
                    <Form.Control type="text" name="diachi" value={formData.diachi} onChange={handleChange} />
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="success" type="submit" className="px-5">Cập Nhật Thông Tin</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
}

export default Profile;
