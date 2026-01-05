const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "thucphamsach_secret";

// ====== ĐĂNG KÝ ======
router.post("/register", async (req, res) => {
  const { ten_dangnhap, email, matkhau, hoten, sodienthoai, diachi } = req.body;

  if (!ten_dangnhap || !email || !matkhau) {
    return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
  }

  const checkSql = "SELECT * FROM nguoidung WHERE ten_dangnhap = ? OR email = ?";
  db.query(checkSql, [ten_dangnhap, email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (results.length > 0) {
      return res.status(400).json({ error: "Tên đăng nhập hoặc email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(matkhau, 10);

    const insertSql = `
      INSERT INTO nguoidung
      (ten_dangnhap, email, matkhau, hoten, vai_tro, sodienthoai, diachi, ngay_tao)
      VALUES (?, ?, ?, ?, 'customer', ?, ?, NOW())
    `;

    db.query(
      insertSql,
      [ten_dangnhap, email, hashedPassword, hoten || null, sodienthoai || null, diachi || null],
      (err) => {
        if (err) return res.status(500).json({ error: "Không thể tạo tài khoản" });
        res.json({ message: "Đăng ký thành công" });
      }
    );
  });
});

// ====== ĐĂNG NHẬP ======
router.post("/login", (req, res) => {
  const { ten_dangnhap, matkhau } = req.body;

  const sql = "SELECT * FROM nguoidung WHERE ten_dangnhap = ?";
  db.query(sql, [ten_dangnhap], async (err, results) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (results.length === 0) {
      return res.status(400).json({ error: "Người dùng không tồn tại" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(matkhau, user.matkhau);

    if (!isMatch) {
      return res.status(400).json({ error: "Sai mật khẩu" });
    }

    const token = jwt.sign(
      { ma_nguoidung: user.ma_nguoidung, vai_tro: user.vai_tro },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        ma_nguoidung: user.ma_nguoidung,
        ten_dangnhap: user.ten_dangnhap,
        vai_tro: user.vai_tro
      }
    });
  });
});

module.exports = router;
