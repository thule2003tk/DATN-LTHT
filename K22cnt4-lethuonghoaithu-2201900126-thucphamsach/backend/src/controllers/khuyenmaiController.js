const db = require("../config/db");

// Lấy danh sách khuyến mãi
exports.getKhuyenMai = (req, res) => {
  // Trả về tất cả để Admin quản lý, Khách sẽ thấy list đầy đủ hoặc lọc ở frontend
  const sql = "SELECT * FROM khuyenmai ORDER BY ngay_ketthuc DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Admin: tạo khuyến mãi mới
exports.createKhuyenMai = (req, res) => {
  const { ten_km, mota, mucgiam, giatri_don, ngay_batdau, ngay_ketthuc, trangthai } = req.body;
  const ma_km = Math.random().toString(36).substr(2, 10).toUpperCase();
  const sql = `INSERT INTO khuyenmai 
               (ma_km, ten_km, mota, mucgiam, giatri_don, ngay_batdau, ngay_ketthuc, trangthai)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [ma_km, ten_km, mota, mucgiam, giatri_don, ngay_batdau, ngay_ketthuc, trangthai], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Tạo khuyến mãi thành công" });
  });
};

// Admin: cập nhật khuyến mãi
exports.updateKhuyenMai = (req, res) => {
  const { ma_km } = req.params;
  const { ten_km, mota, mucgiam, giatri_don, ngay_batdau, ngay_ketthuc, trangthai } = req.body;
  const sql = `UPDATE khuyenmai SET ten_km=?, mota=?, mucgiam=?, giatri_don=?, ngay_batdau=?, ngay_ketthuc=?, trangthai=? WHERE ma_km=?`;
  db.query(sql, [ten_km, mota, mucgiam, giatri_don, ngay_batdau, ngay_ketthuc, trangthai, ma_km], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Cập nhật khuyến mãi thành công" });
  });
};

// Admin: xóa khuyến mãi
exports.deleteKhuyenMai = (req, res) => {
  const { ma_km } = req.params;
  const sql = "DELETE FROM khuyenmai WHERE ma_km=?";
  db.query(sql, [ma_km], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Xóa khuyến mãi thành công" });
  });
};
