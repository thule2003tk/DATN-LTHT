import { useState } from "react";
import { login } from "../api/auth.js";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Form,
  Button,
  InputGroup,
  Alert,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const [ten_dangnhap, setTenDangNhap] = useState("");
  const [matkhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ten_dangnhap.trim()) {
      setError("Vui lòng nhập tên đăng nhập");
      return;
    }
    if (!matkhau) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // 🔐 GỌI API LOGIN
      const res = await login(ten_dangnhap, matkhau);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(res.user);

      alert("Đăng nhập thành công!");

      // 🔀 PHÂN QUYỀN
      if (res.user.vai_tro === "admin" || res.user.vai_tro === "member") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không đúng"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center py-5">
      <Container>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-success">Đăng nhập</h2>
                  <p className="text-muted">Thực phẩm sạch 🌿</p>
                </div>

                {error && (
                  <Alert variant="danger" className="text-center">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>👤</InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={ten_dangnhap}
                        onChange={(e) => setTenDangNhap(e.target.value)}
                        placeholder="Nhập tên đăng nhập"
                        disabled={isLoading}
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>🔒</InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        value={matkhau}
                        onChange={(e) => setMatKhau(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        disabled={isLoading}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? "Ẩn" : "Hiện"}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <span>Chưa có tài khoản? </span>
                  <Link to="/register" className="text-success fw-bold">
                    Đăng ký
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

export default Login;
