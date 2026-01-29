const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ===========================
   GET: danh sách đơn vị sản phẩm
=========================== */
router.get("/", (req, res) => {
    const sql = `
    SELECT dvsp.*, sp.ten_sp, dvt.ten_dvt 
    FROM donvisanpham dvsp
    LEFT JOIN sanpham sp ON dvsp.ma_sp = sp.ma_sp
    LEFT JOIN donvitinh dvt ON dvsp.ma_dvt = dvt.ma_dvt
    ORDER BY dvsp.ma_donvisp DESC
  `;
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/* ===========================
   POST: thêm đơn vị sản phẩm
=========================== */
router.post("/", (req, res) => {
    const { ma_sp, ma_dvt, gia } = req.body;

    if (!ma_sp || !ma_dvt || !gia) {
        return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc (ma_sp, ma_dvt, gia)" });
    }

    const ma_donvisp = "DVSP" + Date.now();

    const sql = "INSERT INTO donvisanpham (ma_donvisp, ma_sp, ma_dvt, gia) VALUES (?, ?, ?, ?)";
    db.query(sql, [ma_donvisp, ma_sp, ma_dvt, gia], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Thêm đơn vị sản phẩm thành công", ma_donvisp });
    });
});

/* ===========================
   PUT: cập nhật đơn vị sản phẩm
=========================== */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { ma_sp, ma_dvt, gia } = req.body;

    const sql = "UPDATE donvisanpham SET ma_sp = ?, ma_dvt = ?, gia = ? WHERE ma_donvisp = ?";
    db.query(sql, [ma_sp, ma_dvt, gia, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Cập nhật đơn vị sản phẩm thành công" });
    });
});

/* ===========================
   DELETE: xoá đơn vị sản phẩm
=========================== */
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM donvisanpham WHERE ma_donvisp = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "🗑️ Đã xoá đơn vị sản phẩm" });
    });
});

module.exports = router;
