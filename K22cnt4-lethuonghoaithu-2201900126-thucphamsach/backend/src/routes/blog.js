const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

// GET danh sách blog (filter category)
router.get("/", (req, res) => {
  const { category } = req.query;
  let sql = "SELECT id, title, img, desc1, desc2, category FROM blog";
  let params = [];

  if (category) {
    sql += " WHERE category = ?";
    params.push(category);
  }

  sql += " ORDER BY id DESC";

  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error("Lỗi GET blog:", err);
      return res.status(500).json({ error: "Lỗi server khi lấy blog", details: err.message });
    }
    res.json(rows);
  });
});

// GET blog theo ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT id, title, img, desc1, desc2, category, content FROM blog WHERE id = ?";

  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("Lỗi GET blog ID:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (rows.length === 0) return res.status(404).json({ error: "Không tìm thấy bài viết" });
    res.json(rows[0]);
  });
});

// POST thêm blog
router.post("/", (req, res) => {
  const { title, img, desc1, desc2, category, content } = req.body;
  const sql = "INSERT INTO blog (title, img, desc1, desc2, category, content) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(sql, [title, img, desc1, desc2, category, content || null], (err, result) => {
    if (err) {
      console.error("Lỗi POST blog:", err);
      return res.status(500).json({ error: "Lỗi thêm blog", details: err.message });
    }
    res.json({ id: result.insertId, message: "Thêm thành công" });
  });
});

// PUT cập nhật
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, img, desc1, desc2, category, content } = req.body;
  const sql = "UPDATE blog SET title=?, img=?, desc1=?, desc2=?, category=?, content=? WHERE id=?";

  db.query(sql, [title, img, desc1, desc2, category, content || null, id], (err) => {
    if (err) {
      console.error("Lỗi PUT blog:", err);
      return res.status(500).json({ error: "Lỗi cập nhật", details: err.message });
    }
    res.json({ message: "Cập nhật thành công" });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM blog WHERE id=?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Lỗi DELETE blog:", err);
      return res.status(500).json({ error: "Lỗi xóa", details: err.message });
    }
    res.json({ message: "Xóa thành công" });
  });
});

module.exports = router;