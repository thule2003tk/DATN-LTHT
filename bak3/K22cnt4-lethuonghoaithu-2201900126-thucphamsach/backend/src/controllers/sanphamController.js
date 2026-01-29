const db = require("../config/db");

// ===============================
// LẤY TẤT CẢ SẢN PHẨM
// ===============================
exports.getAllSanPham = (req, res) => {
  const sql = "SELECT * FROM sanpham";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
};

// ===============================
// LẤY SẢN PHẨM THEO MÃ
// ===============================
exports.getSanPhamByMa = (req, res) => {
  const sql = "SELECT * FROM sanpham WHERE ma_sp = ?";
  db.query(sql, [req.params.ma_sp], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json(results[0]);
  });
};

// ===============================
// TẠO SẢN PHẨM (CÓ UPLOAD ẢNH)
// ===============================
exports.createSanPham = (req, res) => {
  const { ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc } = req.body;

  // 🔥 lấy tên file ảnh đã upload
  const hinhanh = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO sanpham 
    (ma_sp, ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, hinhanh)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const ma_sp = "SP" + Date.now(); // dễ nhìn, dễ báo cáo

  db.query(
    sql,
    [ma_sp, ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, hinhanh],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Không thể tạo sản phẩm" });
      }
      res.json({
        message: "Tạo sản phẩm thành công",
        ma_sp,
        hinhanh,
      });
    }
  );
};

// ===============================
// CẬP NHẬT SẢN PHẨM
// ===============================
exports.updateSanPham = (req, res) => {
  const { ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  let sql = `
    UPDATE sanpham 
    SET ten_sp=?, loai_sp=?, mota=?, gia=?, soluong_ton=?, ma_ncc=?
  `;
  const params = [ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc];

  if (hinhanh) {
    sql += ", hinhanh=?";
    params.push(hinhanh);
  }

  sql += " WHERE ma_sp=?";
  params.push(req.params.ma_sp);

  db.query(sql, params, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Không thể cập nhật sản phẩm" });
    }
    res.json({ message: "Cập nhật sản phẩm thành công" });
  });
};

// ===============================
// XÓA SẢN PHẨM
// ===============================
exports.deleteSanPham = (req, res) => {
  const sql = "DELETE FROM sanpham WHERE ma_sp = ?";
  db.query(sql, [req.params.ma_sp], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Không thể xóa sản phẩm" });
    }
    res.json({ message: "Xóa sản phẩm thành công" });
  });
};
