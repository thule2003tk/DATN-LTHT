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

// Xóa khuyến mãi
exports.deleteKhuyenMai = (req, res) => {
  const { ma_km } = req.params;
  const sql = "DELETE FROM khuyenmai WHERE ma_km=?";
  db.query(sql, [ma_km], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Xóa khuyến mãi thành công" });
  });
};

/* ===============================
   🔥 CHỨC NĂNG LƯU MÃ (DÀNH CHO KHÁCH)
   =============================== */

// Khách: Lưu mã khuyến mãi
exports.saveKhuyenMai = (req, res) => {
  console.log("🚀 [SAVE PROMO] Body:", req.body);
  console.log("🚀 [SAVE PROMO] User from token:", req.user);

  const { ma_km } = req.body;
  const ma_kh = req.user.ma_kh || req.user.ma_nguoidung || req.user.id;

  if (!ma_km) {
    console.warn("⚠️ [SAVE PROMO] Missing ma_km");
    return res.status(400).json({ error: "Thiếu mã khuyến mãi" });
  }

  const sql = "INSERT INTO khachhang_khuyenmai (ma_kh, ma_km) VALUES (?, ?)";
  db.query(sql, [ma_kh, ma_km], (err) => {
    if (err) {
      console.error("❌ [SAVE PROMO] SQL Error:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Bạn đã lưu mã này rồi" });
      }
      return res.status(500).json({ error: err });
    }
    res.json({ message: "Lưu mã thành công" });
  });
};

// Khách: Lấy danh sách mã đã lưu
exports.getMineKhuyenMai = (req, res) => {
  console.log("🚀 [GET MINE PROMOS] User from token:", req.user);
  const ma_kh = req.user.ma_kh || req.user.ma_nguoidung || req.user.id;

  const sql = `
    SELECT km.* 
    FROM khachhang_khuyenmai lk
    JOIN khuyenmai km ON lk.ma_km = km.ma_km
    WHERE lk.ma_kh = ? AND km.trangthai = 'Đang áp dụng'
    ORDER BY lk.ngay_luu DESC
  `;

  db.query(sql, [ma_kh], (err, results) => {
    if (err) {
      console.error("❌ [GET MINE PROMOS] SQL Error:", err);
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
};
