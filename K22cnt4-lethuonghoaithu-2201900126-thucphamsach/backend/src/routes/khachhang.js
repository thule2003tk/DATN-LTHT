const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Lấy tất cả khách hàng (cho admin)
router.get("/", (req, res) => {
  const sql = `
    SELECT ma_kh, ten_kh, email, sodienthoai, diachi, trangthai 
    FROM khachhang 
    ORDER BY ma_kh ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi lấy danh sách khách hàng:", err.message);
      return res.status(500).json({ error: "Lỗi server", details: err.message });
    }
    res.json(rows);
  });
});

// Chặn/Mở chặn khách hàng
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { trangthai } = req.body; // 'active' hoặc 'blocked'

  if (!['active', 'blocked'].includes(trangthai)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const sql = "UPDATE khachhang SET trangthai = ? WHERE ma_kh = ?";
  db.query(sql, [trangthai, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật trạng thái khách hàng:", err.message);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy khách hàng" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

module.exports = router;