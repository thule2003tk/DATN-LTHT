import { useState } from "react";
import { register } from "../api/auth.js";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    ten_dangnhap: "",
    email: "",
    matkhau: "",
    hoten: "",
    sodienthoai: "",
    diachi: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login"); // đăng ký xong chuyển sang login
    } catch (err) {
      setError(err.response?.data?.error || "Lỗi đăng ký");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Đăng ký</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên đăng nhập</label>
          <input className="form-control" name="ten_dangnhap" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" name="email" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" className="form-control" name="matkhau" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Họ tên</label>
          <input className="form-control" name="hoten" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Số điện thoại</label>
          <input className="form-control" name="sodienthoai" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input className="form-control" name="diachi" onChange={handleChange} />
        </div>
        <button className="btn btn-primary">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;
