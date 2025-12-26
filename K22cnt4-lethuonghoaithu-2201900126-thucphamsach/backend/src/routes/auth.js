const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "thucphamsach_secret";

// ====== ĐĂNG KÝ ======
router.post("/register", async (req, res) => {
  const { ten_dangnhap, email, matkhau, hoten, sodienthoai, diachi } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(matkhau, 10);
    const sql = `INSERT INTO nguoidung 
      (ma_nguoidung, ten_dangnhap, email, matkhau, hoten, vai_tro, sodienthoai, diachi, ngay_tao) 
      VALUES (UUID_SHORT(), ?, ?, ?, ?, 'customer', ?, ?, NOW())`;

    db.query(sql, [ten_dangnhap, email, hashedPassword, hoten, sodienthoai, diachi], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Đăng ký thành công!" });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// ====== ĐĂNG NHẬP ======
router.post("/login", (req, res) => {
  const { ten_dangnhap, matkhau } = req.body;
  const sql = "SELECT * FROM nguoidung WHERE ten_dangnhap = ?";
  db.query(sql, [ten_dangnhap], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(400).json({ error: "Người dùng không tồn tại" });

    const user = results[0];
    const isMatch = await bcrypt.compare(matkhau, user.matkhau);
    if (!isMatch) return res.status(400).json({ error: "Sai mật khẩu" });

    const token = jwt.sign(
      { ma_nguoidung: user.ma_nguoidung, vai_tro: user.vai_tro },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Đăng nhập thành công", token, user: { ten_dangnhap: user.ten_dangnhap, vai_tro: user.vai_tro } });
  });
});

module.exports = router;
