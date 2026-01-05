const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { verifyToken, checkAdmin } = require("../middleware/auth");

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
 * PUT: ADMIN DUYỆT / ĐỔI ROLE
 * ===============================
 */
router.put("/:id/role", verifyToken, checkAdmin, (req, res) => {
  const { id } = req.params;
  const { vai_tro } = req.body;

  if (!["admin", "member", "customer"].includes(vai_tro)) {
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

module.exports = router;
