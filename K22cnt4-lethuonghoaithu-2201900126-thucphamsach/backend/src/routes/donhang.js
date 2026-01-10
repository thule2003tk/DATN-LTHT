const express = require("express");
const router = express.Router();
const db = require("../config/db.js"); // ← ĐÚNG 100% CHO CẤU TRÚC CỦA BẠN

// Tạo đơn hàng mới
router.post("/", async (req, res) => {
  try {
    const { ma_kh } = req.body;
    const sql = "INSERT INTO donhang (ma_kh, ngay_dat, tong_tien, trang_thai) VALUES (?, NOW(), 0, 'Chờ xác nhận')";
    const [result] = await db.query(sql, [ma_kh]);
    res.json({ ma_donhang: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tạo đơn hàng" });
  }
});

// Lấy tất cả đơn hàng (Admin)
router.get("/admin", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM donhang ORDER BY ngay_dat DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy đơn hàng" });
  }
});

// Lấy chi tiết đơn hàng
router.get("/detail/:ma_donhang", async (req, res) => {
  try {
    const { ma_donhang } = req.params;
    const [rows] = await db.query("SELECT * FROM chitiet_donhang WHERE ma_donhang = ?", [ma_donhang]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy chi tiết" });
  }
});

// Cập nhật trạng thái đơn hàng
router.put("/:ma_donhang", async (req, res) => {
  try {
    const { ma_donhang } = req.params;
    const { trangthai } = req.body;
    await db.query("UPDATE donhang SET trang_thai = ? WHERE ma_donhang = ?", [trangthai, ma_donhang]);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi cập nhật" });
  }
});

module.exports = router; // ← QUAN TRỌNG: PHẢI CÓ DÒNG NÀY!