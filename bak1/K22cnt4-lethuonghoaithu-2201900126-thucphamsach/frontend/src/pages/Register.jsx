import { useState } from "react";
import { register } from "../api/auth.js";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, InputGroup, Alert } from "react-bootstrap";

function Register() {
  const [form, setForm] = useState({
    ten_dangnhap: "",
    matkhau: "",
    hoten: "",
    email: "",
    sodienthoai: "",
    diachi: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.ten_dangnhap.trim()) newErrors.ten_dangnhap = "Tên đăng nhập bắt buộc";
    if (!form.matkhau || form.matkhau.length < 6) newErrors.matkhau = "Mật khẩu ít nhất 6 ký tự";
    if (!form.hoten.trim()) newErrors.hoten = "Họ tên bắt buộc";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email không hợp lệ";
    if (!form.sodienthoai.trim()) newErrors.sodienthoai = "Số điện thoại bắt buộc";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await register(form);
      alert("Đăng ký thành công! Hãy đăng nhập nhé 🥬");
      navigate("/login");
    } catch (err) {
      setErrors({ server: err.response?.data?.error || "Lỗi đăng ký, thử lại sau" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-5">
                  <h2 className="fw-bold text-success">Đăng Ký Tài Khoản</h2>
                  <p className="text-muted">Tham gia cộng đồng Thực Phẩm Sạch ngay hôm nay!</p>
                </div>

                {errors.server && <Alert variant="danger" className="rounded-3">{errors.server}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>👤</InputGroup.Text>
                      <Form.Control name="ten_dangnhap" value={form.ten_dangnhap} onChange={handleChange} isInvalid={!!errors.ten_dangnhap} />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{errors.ten_dangnhap}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>🔒</InputGroup.Text>
                      <Form.Control type={showPassword ? "text" : "password"} name="matkhau" value={form.matkhau} onChange={handleChange} isInvalid={!!errors.matkhau} />
                      <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Ẩn" : "Hiện"}
                      </Button>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{errors.matkhau}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Họ tên</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>📛</InputGroup.Text>
                      <Form.Control name="hoten" value={form.hoten} onChange={handleChange} isInvalid={!!errors.hoten} />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>@</InputGroup.Text>
                      <Form.Control type="email" name="email" value={form.email} onChange={handleChange} isInvalid={!!errors.email} />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>📱</InputGroup.Text>
                      <Form.Control name="sodienthoai" value={form.sodienthoai} onChange={handleChange} isInvalid={!!errors.sodienthoai} />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Địa chỉ</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>🏠</InputGroup.Text>
                      <Form.Control name="diachi" value={form.diachi} onChange={handleChange} placeholder="Không bắt buộc" />
                    </InputGroup>
                  </Form.Group>

                  <Button variant="success" size="lg" type="submit" className="w-100 rounded-pill" disabled={isLoading}>
                    {isLoading ? "Đang đăng ký..." : "Đăng Ký Ngay"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <span className="text-muted">Đã có tài khoản? </span>
                  <Link to="/login" className="text-success fw-bold">
                    Đăng nhập
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Register;