const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { verifyToken } = require("../middlewares/auth");

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
      VALUES (?, ?, ?, ?, 'member', ?, ?, NOW())
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

    // 🛡️ Kiểm tra nếu tài khoản bị chặn
    if (user.trangthai === 'blocked') {
      return res.status(403).json({ error: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên." });
    }

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
        email: user.email,
        hoten: user.hoten,
        sodienthoai: user.sodienthoai,
        diachi: user.diachi,
        vai_tro: user.vai_tro
      }
    });
  });
});

// ====== LẤY THÔNG TIN NGƯỜI DÙNG ======
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.user.ma_nguoidung;

  const sql = "SELECT ma_nguoidung, ten_dangnhap, email, hoten, sodienthoai, diachi, vai_tro FROM nguoidung WHERE ma_nguoidung = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user profile:", err);
      return res.status(500).json({ error: "Lỗi server khi lấy thông tin người dùng" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Người dùng không tìm thấy" });
    }
    const user = results[0];
    res.json(user);
  });
});

// ====== CẬP NHẬT THÔNG TIN NGƯỜI DÙNG ======
router.put("/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const { hoten, sodienthoai, diachi } = req.body;
  const userIdFromToken = req.user.ma_nguoidung;

  // 🛡️ Bảo mật: Chỉ người dùng đó hoặc Admin mới được sửa
  if (parseInt(id) !== userIdFromToken && req.user.vai_tro !== 'admin') {
    return res.status(403).json({ error: "Bạn không có quyền cập nhật thông tin này" });
  }

  const sql = "UPDATE nguoidung SET hoten = ?, sodienthoai = ?, diachi = ? WHERE ma_nguoidung = ?";
  db.query(sql, [hoten, sodienthoai, diachi, id], (err, result) => {
    if (err) {
      console.error("Error updating user profile:", err);
      return res.status(500).json({ error: "Lỗi server khi cập nhật thông tin" });
    }

    // Trả về thông tin mới (trừ mật khẩu)
    db.query("SELECT ma_nguoidung, ten_dangnhap, email, hoten, sodienthoai, diachi, vai_tro FROM nguoidung WHERE ma_nguoidung = ?", [id], (err, results) => {
      if (err) return res.status(500).json({ error: "Lỗi lấy lại thông tin sau cập nhật" });
      res.json(results[0]);
    });
  });
});

module.exports = router;
