const db = require("../config/db");

// Gửi liên hệ
exports.createLienHe = (req, res) => {
  const { ten, email, noidung } = req.body;
  const sql = "INSERT INTO lienhe (ten, email, noidung) VALUES (?, ?, ?)";
  db.query(sql, [ten, email, noidung], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Gửi liên hệ thành công" });
  });
};

// Admin: lấy tất cả liên hệ
exports.getAllLienHe = (req, res) => {
  const sql = "SELECT * FROM lienhe ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Admin: trả lời liên hệ
exports.replyLienHe = (req, res) => {
  const { id } = req.params;
  const { traloi } = req.body;
  const sql = "UPDATE lienhe SET traloi=?, trangthai='Đã trả lời' WHERE id=?";
  db.query(sql, [traloi, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Đã trả lời liên hệ" });
  });
};

// Admin: xóa liên hệ
exports.deleteLienHe = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM lienhe WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Xóa liên hệ thành công" });
  });
};
