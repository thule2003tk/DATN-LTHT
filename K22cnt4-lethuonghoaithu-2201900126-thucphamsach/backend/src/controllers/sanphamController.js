const db = require("../config/db");

// ===============================
// LẤY TẤT CẢ SẢN PHẨM
// ===============================
exports.getAllSanPham = (req, res) => {
  const sql = "SELECT * FROM sanpham";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("getAllSanPham error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.json(results);
  });
};

// ===============================
// LẤY SẢN PHẨM THEO MÃ
// ===============================
exports.getSanPhamByMa = (req, res) => {
  const { ma_sp } = req.params;

  const sql = "SELECT * FROM sanpham WHERE ma_sp = ?";
  db.query(sql, [ma_sp], (err, results) => {
    if (err) {
      console.error("getSanPhamByMa error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    res.json(results[0]);
  });
};

// ===============================
// 🔥 LẤY ĐƠN VỊ + GIÁ THEO SẢN PHẨM
// ===============================
exports.getDonViTheoSanPham = (req, res) => {
  const { ma_sp } = req.params;

  console.log("👉 getDonViTheoSanPham:", ma_sp); // DEBUG

  const sql = `
    SELECT 
      dvt.ma_dvt,
      dvt.ten_dvt,
      dvsp.gia
    FROM donvisanpham dvsp
    JOIN donvitinh dvt ON dvsp.ma_dvt = dvt.ma_dvt
    WHERE dvsp.ma_sp = ?
  `;

  db.query(sql, [ma_sp], (err, results) => {
    if (err) {
      console.error("getDonViTheoSanPham error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    // 🔎 Không có dữ liệu vẫn trả JSON (để FE dễ xử lý)
    res.json(results);
  });
};

// ===============================
// TẠO SẢN PHẨM (CÓ UPLOAD ẢNH)
// ===============================
exports.createSanPham = (req, res) => {
  const { ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, ma_dvt } = req.body;

  const hinhanh = req.file ? req.file.filename : null;
  const ma_sp = "SP" + Date.now();

  const sql = `
    INSERT INTO sanpham 
    (ma_sp, ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, hinhanh, ma_dvt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ma_sp, ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, hinhanh, ma_dvt],
    (err) => {
      if (err) {
        console.error("createSanPham error:", err);
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
  const { ten_sp, loai_sp, mota, gia, soluong_ton, ma_ncc, ma_dvt } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  let sql = `
    UPDATE sanpham 
    SET ten_sp=?, loai_sp=?, mota=?, gia=?, soluong_ton=?, ma_ncc=?, ma_dvt=?
  `;
  const params = [
    ten_sp,
    loai_sp,
    mota,
    gia,
    soluong_ton,
    ma_ncc,
    ma_dvt,
  ];

  if (hinhanh) {
    sql += ", hinhanh=?";
    params.push(hinhanh);
  }

  sql += " WHERE ma_sp=?";
  params.push(req.params.ma_sp);

  db.query(sql, params, (err) => {
    if (err) {
      console.error("updateSanPham error:", err);
      return res.status(500).json({ error: "Không thể cập nhật sản phẩm" });
    }
    res.json({ message: "Cập nhật sản phẩm thành công" });
  });
};

// ===============================
// XÓA SẢN PHẨM
// ===============================
exports.deleteSanPham = (req, res) => {
  const { ma_sp } = req.params;

  const sql = "DELETE FROM sanpham WHERE ma_sp = ?";
  db.query(sql, [ma_sp], (err) => {
    if (err) {
      console.error("deleteSanPham error:", err);
      return res.status(500).json({ error: "Không thể xóa sản phẩm" });
    }
    res.json({ message: "Xóa sản phẩm thành công" });
  });
};
