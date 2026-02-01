const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Lấy danh sách khách hàng (CHỈ NHỮNG NGƯỜI ĐÃ TỪNG ĐẶT HÀNG)
router.get("/", (req, res) => {
  const sql = `
    SELECT DISTINCT 
      n.ma_nguoidung as ma_kh, 
      n.hoten as ten_kh, 
      n.email, 
      n.sodienthoai, 
      n.diachi, 
      n.trangthai,
      n.vai_tro
    FROM nguoidung n
    INNER JOIN donhang d ON n.ma_nguoidung = d.ma_kh
    WHERE n.vai_tro != 'admin'
    ORDER BY n.ma_nguoidung ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Lỗi lấy danh sách khách hàng:", err.message);
      return res.status(500).json({ error: "Lỗi server", details: err.message });
    }
    res.json(rows);
  });
});

// Cập nhật thông tin khách hàng (Sửa)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { ten_kh, email, sodienthoai, diachi } = req.body;

  const sql = `
    UPDATE nguoidung 
    SET hoten = ?, email = ?, sodienthoai = ?, diachi = ? 
    WHERE ma_nguoidung = ?
  `;

  db.query(sql, [ten_kh, email, sodienthoai, diachi, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật khách hàng:", err.message);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json({ message: "Cập nhật thành công" });
  });
});

// Chặn/Mở chặn người dùng (Khách hàng/Nhân viên)
router.put("/:id/status", (req, res) => {
  const { id } = req.params;
  const { trangthai } = req.body; // 'active' hoặc 'blocked'

  if (!['active', 'blocked'].includes(trangthai)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ" });
  }

  const sql = "UPDATE nguoidung SET trangthai = ? WHERE ma_nguoidung = ?";
  db.query(sql, [trangthai, id], (err, result) => {
    if (err) {
      console.error("Lỗi cập nhật trạng thái người dùng:", err.message);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }
    res.json({ message: "Cập nhật trạng thái thành công" });
  });
});

module.exports = router;