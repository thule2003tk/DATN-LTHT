import { useState } from "react";
import { login } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

function Login() {
  const [ten_dangnhap, setTenDangNhap] = useState("");
  const [matkhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(ten_dangnhap, matkhau);
      localStorage.setItem("token", data.token);
      navigate("/"); // đăng nhập xong về trang chủ
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đăng nhập");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Đăng nhập</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên đăng nhập</label>
          <input className="form-control" value={ten_dangnhap} onChange={e => setTenDangNhap(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" className="form-control" value={matkhau} onChange={e => setMatKhau(e.target.value)} />
        </div>
        <button className="btn btn-primary">Đăng nhập</button>
      </form>
    </div>
  );
}

export default Login;
