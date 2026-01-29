const db = require("../config/db");

// ===============================
// LẤY TẤT CẢ ĐƠN VỊ SẢN PHẨM
// ===============================
exports.getAllDonViSanPham = (req, res) => {
    const sql = "SELECT * FROM donvisanpham";
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server" });
        }
        res.json(results);
    });
};

// ===============================
// LẤY ĐƠN VỊ SẢN PHẨM THEO MÃ
// ===============================
exports.getDonViSanPhamByMa = (req, res) => {
    const sql = "SELECT * FROM donvisanpham WHERE ma_donvisp = ?";
    db.query(sql, [req.params.ma_donvisp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy đơn vị sản phẩm" });
        }
        res.json(results[0]);
    });
};

// LẤY ĐƠN VỊ SẢN PHẨM THEO MÃ SẢN PHẨM
// ===============================
exports.getDonViSanPhamByMaSP = (req, res) => {
    const sql = "SELECT dvsp.gia,dvsp.ma_donvisp, dvsp.ma_dvt,dvsp.ma_sp,dv.mota, dv.size, dv.trangthai, dv.ten_dvt FROM donvisanpham dvsp INNER JOIN donvitinh dv ON dv.ma_dvt = dvsp.ma_dvt WHERE dvsp.ma_sp = ?";
    db.query(sql, [req.params.ma_sp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Lỗi server" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Không tìm thấy đơn vị sản phẩm" });
        }
        res.json(results);
    });
};

// ===============================
// TẠO ĐƠN VỊ SẢN PHẨM
// ===============================
exports.createDonViSanPham = (req, res) => {
    const { ma_sp, ma_donvi, gia } = req.body;
    const ma_donvisp = "DVSP" + Date.now();

    const sql = `
    INSERT INTO donvisanpham (ma_donvisp, ma_sp, ma_donvi, gia)
    VALUES (?, ?, ?, ?)
  `;

    db.query(sql, [ma_donvisp, ma_sp, ma_donvi, gia], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Không thể tạo đơn vị sản phẩm" });
        }
        res.json({
            message: "Tạo đơn vị sản phẩm thành công",
            ma_donvisp,
        });
    });
};

// ===============================
// CẬP NHẬT ĐƠN VỊ SẢN PHẨM
// ===============================
exports.updateDonViSanPham = (req, res) => {
    const { ma_sp, ma_donvi, gia } = req.body;
    const sql = `
    UPDATE donvisanpham 
    SET ma_sp = ?, ma_donvi = ?, gia = ?
    WHERE ma_donvisp = ?
  `;

    db.query(sql, [ma_sp, ma_donvi, gia, req.params.ma_donvisp], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Không thể cập nhật đơn vị sản phẩm" });
        }
        res.json({ message: "Cập nhật đơn vị sản phẩm thành công" });
    });
};

// ===============================
// XÓA ĐƠN VỊ SẢN PHẨM
// ===============================
exports.deleteDonViSanPham = (req, res) => {
    const sql = "DELETE FROM donvisanpham WHERE ma_donvisp = ?";
    db.query(sql, [req.params.ma_donvisp], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Không thể xóa đơn vị sản phẩm" });
        }
        res.json({ message: "Xóa đơn vị sản phẩm thành công" });
    });
};
