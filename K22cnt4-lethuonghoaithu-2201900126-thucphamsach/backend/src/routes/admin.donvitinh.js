const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ===========================
   GET: danh sách đơn vị tính
=========================== */
router.get("/", (req, res) => {
    const sql = "SELECT * FROM donvitinh ORDER BY ma_dvt DESC";
    db.query(sql, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/* ===========================
   GET: chi tiết 1 đơn vị tính
=========================== */
router.get("/:id", (req, res) => {
    db.query(
        "SELECT * FROM donvitinh WHERE ma_dvt = ?",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            if (rows.length === 0)
                return res.status(404).json({ error: "Không tìm thấy đơn vị tính" });

            res.json(rows[0]);
        }
    );
});

/* ===========================
   POST: thêm đơn vị tính
=========================== */
router.post("/", (req, res) => {
    const { ten_dvt, mota, size, trangthai } = req.body;

    if (!ten_dvt) {
        return res.status(400).json({ error: "Tên đơn vị tính không được để trống" });
    }

    // Tạo mã đơn vị tính tự động (DVT + timestamp)
    const ma_dvt = "DVT" + Date.now();

    const sql = "INSERT INTO donvitinh (ma_dvt, ten_dvt, mota, size, trangthai) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [ma_dvt, ten_dvt, mota || null, size || null, trangthai || 1], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "✅ Thêm đơn vị tính thành công", ma_dvt });
    });
});

/* ===========================
   PUT: cập nhật đơn vị tính
=========================== */
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { ten_dvt, mota, size, trangthai } = req.body;

    if (!ten_dvt) {
        return res.status(400).json({ error: "Tên đơn vị tính không được để trống" });
    }

    const sql = "UPDATE donvitinh SET ten_dvt = ?, mota = ?, size = ?, trangthai = ? WHERE ma_dvt = ?";
    db.query(sql, [ten_dvt, mota || null, size || null, trangthai, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Không tìm thấy đơn vị tính để cập nhật" });
        res.json({ message: "✅ Cập nhật đơn vị tính thành công" });
    });
});

/* ===========================
   DELETE: xoá đơn vị tính
=========================== */
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM donvitinh WHERE ma_dvt = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0)
            return res.status(404).json({ error: "Không tìm thấy đơn vị tính để xoá" });
        res.json({ message: "🗑️ Đã xoá đơn vị tính" });
    });
});

module.exports = router;
