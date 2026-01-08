const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET blog (có filter)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let sql = `
      SELECT DISTINCT title, img, desc1, desc2, category
      FROM blog
    `;

    let params = [];

    if (category) {
      sql += " WHERE category = ?";
      params.push(category);
    }

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy blog:", err);
    res.status(500).json({ error: "Lỗi lấy blog" });
  }const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ===============================
// 📌 GET DANH SÁCH BLOG (CÓ FILTER CATEGORY)
// ===============================
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let sql = `
      SELECT DISTINCT id, title, img, desc1, desc2, category
      FROM blog
    `;

    let params = [];

    if (category) {
      sql += " WHERE category = ?";
      params.push(category);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Lỗi lấy blog:", err);
    res.status(500).json({ error: "Lỗi lấy blog" });
  }
});


// ===============================
// 📌 GET BLOG THEO ID
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const sql = `
      SELECT id, title, img, desc1, desc2, category, content 
      FROM blog 
      WHERE id = ?
    `;

    const [rows] = await db.query(sql, [req.params.id]);

    if (rows.length === 0)
      return res.status(404).json({ error: "Không tìm thấy bài viết" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Lỗi lấy blog theo ID:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});


// ===============================
// 📌 THÊM BLOG
// ===============================
router.post("/", async (req, res) => {
  try {
    const { title, img, desc1, desc2, category, content } = req.body;

    const sql = `
      INSERT INTO blog (title, img, desc1, desc2, category, content)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title,
      img,
      desc1,
      desc2,
      category,
      content
    ]);

    res.json({ id: result.insertId, message: "Thêm thành công" });
  } catch (err) {
    console.error("Lỗi thêm blog:", err);
    res.status(500).json({ error: "Lỗi thêm blog" });
  }
});


// ===============================
// 📌 CẬP NHẬT BLOG
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { title, img, desc1, desc2, category, content } = req.body;

    const sql = `
      UPDATE blog 
      SET title=?, img=?, desc1=?, desc2=?, category=?, content=? 
      WHERE id=?
    `;

    await db.query(sql, [
      title,
      img,
      desc1,
      desc2,
      category,
      content,
      req.params.id
    ]);

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật blog:", err);
    res.status(500).json({ error: "Lỗi cập nhật blog" });
  }
});


// ===============================
// 📌 XOÁ BLOG
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM blog WHERE id = ?", [req.params.id]);
    res.json({ message: "Xoá thành công" });
  } catch (err) {
    console.error("Lỗi xoá blog:", err);
    res.status(500).json({ error: "Lỗi xoá blog" });
  }
});

module.exports = router;

});
// GET blog theo ID
router.get("/:id", (req, res) => {
  const sql = "SELECT id, title, img, desc1, desc2, category, content FROM blog WHERE id = ?";
  db.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Lỗi server" });
    if (rows.length === 0) return res.status(404).json({ error: "Không tìm thấy bài viết" });
    res.json(rows[0]);
  });
});


// Thêm blog
router.post("/", (req, res) => {
  const { title, img, desc1, desc2, category } = req.body;

  const sql = `
    INSERT INTO blog (title, img, desc1, desc2, category)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, img, desc1, desc2, category], (err, result) => {
    if (err) {
      console.error("Lỗi thêm blog:", err);
      return res.status(500).json({ error: "Lỗi thêm blog" });
    }
    res.json({ id: result.insertId, message: "Thêm thành công" });
  });
});

// Cập nhật blog
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, img, desc1, desc2, category } = req.body;

  const sql = `
    UPDATE blog SET title=?, img=?, desc1=?, desc2=?, category=? WHERE id=?
  `;

  db.query(sql, [title, img, desc1, desc2, category, id], (err) => {
    if (err) {
      console.error("Lỗi cập nhật:", err);
      return res.status(500).json({ error: "Lỗi cập nhật blog" });
    }
    res.json({ message: "Cập nhật thành công" });
  });
});

// Xoá blog
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM blog WHERE id=?", [id], (err) => {
    if (err) {
      console.error("Lỗi xoá:", err);
      return res.status(500).json({ error: "Lỗi xoá blog" });
    }
    res.json({ message: "Xoá thành công" });
  });
});

module.exports = router;
