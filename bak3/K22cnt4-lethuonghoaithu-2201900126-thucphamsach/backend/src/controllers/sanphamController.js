const db = require("../config/db");

// ===============================
// LẤY TẤT CẢ SẢN PHẨM
// ===============================
exports.getAllSanPham = (req, res) => {
  const sql = `
    SELECT sp.*, d.ten_danhmuc as ten_dm_chinh, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp
    LEFT JOIN danhmuc d ON sp.ma_danhmuc = d.ma_danhmuc
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    GROUP BY sp.ma_sp
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("getAllSanPham error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    // Parse danhmuc_ids into array
    const data = results.map(r => ({
      ...r,
      danhmuc_ids: r.danhmuc_ids ? r.danhmuc_ids.split(',') : (r.ma_danhmuc ? [r.ma_danhmuc] : [])
    }));
    res.json(data);
  });
};

// ===============================
// LẤY SẢN PHẨM THEO MÃ
// ===============================
exports.getSanPhamByMa = (req, res) => {
  const { ma_sp } = req.params;

  const sql = `
    SELECT sp.*, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    WHERE sp.ma_sp = ?
    GROUP BY sp.ma_sp
  `;
  db.query(sql, [ma_sp], (err, results) => {
    if (err) {
      console.error("getSanPhamByMa error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
    }
    const product = {
      ...results[0],
      danhmuc_ids: results[0].danhmuc_ids ? results[0].danhmuc_ids.split(',') : (results[0].ma_danhmuc ? [results[0].ma_danhmuc] : [])
    };
    res.json(product);
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
  const { ten_sp, ten_danhmuc, ma_danhmuc, mota, gia, soluong_ton, ma_ncc, ma_dvt, thongtin_sanpham, is_featured } = req.body;

  const hinhanh = req.file ? req.file.filename : null;
  const ma_sp = "SP" + Date.now();

  const sql = `
    INSERT INTO sanpham 
    (ma_sp, ten_sp, ten_danhmuc, ma_danhmuc, mota, gia, soluong_ton, ma_ncc, hinhanh, ma_dvt, thongtin_sanpham, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [ma_sp, ten_sp, ten_danhmuc, ma_danhmuc, mota, gia, soluong_ton, ma_ncc, hinhanh, ma_dvt, thongtin_sanpham, is_featured || 0],
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
  const { ten_sp, ten_danhmuc, ma_danhmuc, mota, gia, soluong_ton, ma_ncc, ma_dvt, thongtin_sanpham, is_featured } = req.body;
  const hinhanh = req.file ? req.file.filename : null;

  let sql = `
    UPDATE sanpham 
    SET ten_sp=?, ten_danhmuc=?, ma_danhmuc=?, mota=?, gia=?, soluong_ton=?, ma_ncc=?, ma_dvt=?, thongtin_sanpham=?, is_featured=?
  `;
  const params = [
    ten_sp,
    ten_danhmuc,
    ma_danhmuc,
    mota,
    gia,
    soluong_ton,
    ma_ncc,
    ma_dvt,
    thongtin_sanpham,
    is_featured,
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
// ⭐ LẤY SẢN PHẨM NỔI BẬT (BÁN CHẠY NHẤT)
// ===============================
exports.getTopSellingProducts = (req, res) => {
  console.log("🚀 Calling getTopSellingProducts...");
  const sql = `
    SELECT sp.*, d.ten_danhmuc as ten_dm_chinh, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp
    LEFT JOIN danhmuc d ON sp.ma_danhmuc = d.ma_danhmuc
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    WHERE sp.is_featured = 1
    GROUP BY sp.ma_sp
    ORDER BY sp.created_at DESC, sp.ma_sp DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("getTopSellingProducts error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    const data = results.map(r => ({
      ...r,
      danhmuc_ids: r.danhmuc_ids ? r.danhmuc_ids.split(',') : (r.ma_danhmuc ? [r.ma_danhmuc] : [])
    }));
    res.json(data);
  });
};

// ===============================
// 🆕 LẤY SẢN PHẨM MỚI (VỪA NHẬP)
// ===============================
exports.getNewArrivals = (req, res) => {
  console.log("🚀 Calling getNewArrivals...");
  const sql = `
    SELECT sp.*, d.ten_danhmuc as ten_dm_chinh, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp 
    LEFT JOIN danhmuc d ON sp.ma_danhmuc = d.ma_danhmuc 
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    GROUP BY sp.ma_sp
    ORDER BY sp.created_at DESC LIMIT 12
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("getNewArrivals error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    const data = results.map(r => ({
      ...r,
      danhmuc_ids: r.danhmuc_ids ? r.danhmuc_ids.split(',') : (r.ma_danhmuc ? [r.ma_danhmuc] : [])
    }));
    res.json(data);
  });
};

// ===============================
// 🎁 LẤY SẢN PHẨM KHUYẾN MÃI (TỒN KHO > 1 TUẦN)
// ===============================
exports.getPromotionProducts = (req, res) => {
  console.log("🚀 Calling getPromotionProducts...");
  const sql = `
    SELECT sp.*, d.ten_danhmuc as ten_dm_chinh, GROUP_CONCAT(sd.ma_danhmuc) as danhmuc_ids
    FROM sanpham sp 
    LEFT JOIN danhmuc d ON sp.ma_danhmuc = d.ma_danhmuc 
    LEFT JOIN sanpham_danhmuc sd ON sp.ma_sp = sd.ma_sp
    WHERE sp.phan_tram_giam_gia > 0 OR sp.created_at < NOW() - INTERVAL 1 WEEK 
    GROUP BY sp.ma_sp
    ORDER BY sp.phan_tram_giam_gia DESC, sp.created_at ASC 
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("getPromotionProducts error:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    const data = results.map(r => ({
      ...r,
      danhmuc_ids: r.danhmuc_ids ? r.danhmuc_ids.split(',') : (r.ma_danhmuc ? [r.ma_danhmuc] : [])
    }));
    res.json(data);
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
