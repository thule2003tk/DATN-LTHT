const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// Lấy tất cả khách hàng (cho admin)
router.get("/", (req, res) => {
  const sql = `
    SELECT ma_kh, ten_kh, email, sodienthoai, diachi 
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

module.exports = router;