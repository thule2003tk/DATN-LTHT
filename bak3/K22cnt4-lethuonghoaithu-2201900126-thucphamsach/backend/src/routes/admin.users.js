const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

/**
 * ===============================
 * GET: LẤY DANH SÁCH NGƯỜI DÙNG
 * ===============================
 */
router.get("/", verifyToken, checkAdmin, (req, res) => {
  const sql = `
    SELECT 
      ma_nguoidung,
      ten_dangnhap,
      email,
      hoten,
      vai_tro,
      trangthai as status,
      ngay_tao
    FROM nguoidung
    ORDER BY ngay_tao DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(rows);
  });
});

/**
 * ===============================
 * PUT: ADMIN ĐỔI ROLE
 * ===============================
 */
router.put("/:id/role", verifyToken, checkAdmin, (req, res) => {
  const { id } = req.params;
  const { vai_tro } = req.body;

  if (!["admin", "staff", "member", "customer", "CUSTOMER"].includes(vai_tro)) {
    return res.status(400).json({ error: "Vai trò không hợp lệ" });
  }

  const sql = "UPDATE nguoidung SET vai_tro = ? WHERE ma_nguoidung = ?";
  db.query(sql, [vai_tro, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Không thể cập nhật vai trò" });
    }
    res.json({ message: "Cập nhật vai trò thành công" });
  });
});

/**
 * ===============================
 * PUT: ADMIN CHẶN / MỞ CHẶN
 * ===============================
 */
router.put("/:id/status", verifyToken, checkAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const sql = "UPDATE nguoidung SET trangthai = ? WHERE ma_nguoidung = ?";
  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Không thể cập nhật trạng thái" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

module.exports = router;
