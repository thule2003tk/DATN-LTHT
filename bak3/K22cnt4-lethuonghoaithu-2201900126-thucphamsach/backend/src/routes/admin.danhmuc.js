const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ===========================
   GET: danh sách danh mục
=========================== */
router.get("/", (req, res) => {
  const sql = "SELECT * FROM danhmuc ORDER BY ma_danhmuc DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ===========================
   GET: chi tiết 1 danh mục
=========================== */
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM danhmuc WHERE ma_danhmuc = ?",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0)
        return res.status(404).json({ error: "Không tìm thấy danh mục" });

      res.json(rows[0]);
    }
  );
});

/* ===========================
   POST: thêm danh mục
=========================== */
router.post("/", (req, res) => {
  const { ten_danhmuc, icon } = req.body;

  if (!ten_danhmuc) {
    return res.status(400).json({ error: "Tên danh mục không được để trống" });
  }

  // Tạo mã danh mục tự động (ví dụ: DM + timestamp)
  const ma_danhmuc = "DM" + Date.now();

  const sql = "INSERT INTO danhmuc (ma_danhmuc, ten_danhmuc, icon) VALUES (?, ?, ?)";
  db.query(sql, [ma_danhmuc, ten_danhmuc, icon || null], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Thêm danh mục thành công", ma_danhmuc });
  });
});

/* ===========================
   PUT: cập nhật danh mục
=========================== */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { ten_danhmuc, icon } = req.body;

  if (!ten_danhmuc) {
    return res.status(400).json({ error: "Tên danh mục không được để trống" });
  }

  const sql = "UPDATE danhmuc SET ten_danhmuc = ?, icon = ? WHERE ma_danhmuc = ?";
  db.query(sql, [ten_danhmuc, icon || null, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Không tìm thấy danh mục để cập nhật" });
    res.json({ message: "✅ Cập nhật danh mục thành công" });
  });
});

/* ===========================
   DELETE: xoá danh mục
=========================== */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM danhmuc WHERE ma_danhmuc = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Không tìm thấy danh mục để xoá" });
    res.json({ message: "🗑️ Đã xoá danh mục" });
  });
});

module.exports = router;
