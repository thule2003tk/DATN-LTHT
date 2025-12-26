const db = require("../config/db");

// Lấy tất cả sản phẩm
exports.getAllSanPham = (req, res) => {
  const sql = "SELECT * FROM sanpham";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Lấy sản phẩm theo ma_sp
exports.getSanPhamByMa = (req, res) => {
  const sql = "SELECT * FROM sanpham WHERE ma_sp = ?";
  db.query(sql, [req.params.ma_sp], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    res.json(results[0]);
  });
};

// Tạo sản phẩm
exports.createSanPham = (req, res) => {
  const { ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  const sql = `INSERT INTO sanpham (ma_sp, ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, hinhanh)
               VALUES (UUID_SHORT(), ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, hinhanh], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Tạo sản phẩm thành công" });
  });
};

// Cập nhật sản phẩm
exports.updateSanPham = (req, res) => {
  const { ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  let sql = "UPDATE sanpham SET ten_sp=?, loai_sp=?, mota=?, gia=?, soluong_ton=?, ma_ncc=?";
  const params = [ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc];

  if (hinhanh) {
    sql += ", hinhanh=?";
    params.push(hinhanh);
  }

  sql += " WHERE ma_sp=?";
  params.push(req.params.ma_sp);

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Cập nhật sản phẩm thành công" });
  });
};

// Xóa sản phẩm
exports.deleteSanPham = (req, res) => {
  const sql = "DELETE FROM sanpham WHERE ma_sp = ?";
  db.query(sql, [req.params.ma_sp], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Xóa sản phẩm thành công" });
  });
};
